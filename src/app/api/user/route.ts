import { s3 } from '@/libs/s3'
import UserModel from '@/models/User'
import { zEmailSchema, zUserCreationServerSchema } from '@/schemas/schema'
import {
  generateAccessToken,
  generateRefreshToken,
  hashPass,
  verifyTemporaryToken,
} from '@/utils/auth'
import DbConnect from '@/utils/dbConnection'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const temporaryToken = cookieStore.get('temporaryToken')

    if (!temporaryToken) {
      return Response.json({ message: 'Unauthorized token' }, { status: 401 })
    }

    const payload = verifyTemporaryToken(temporaryToken.value)
    if (!payload) {
      return Response.json({ message: 'Unauthorized payload' }, { status: 401 })
    }

    const formData = await req.formData()
    const fullName = formData.get('fullName')
    const username = formData.get('username')
    const password = formData.get('password')
    const avatar = formData.get('avatar') as File

    const body = { fullName, username, password, avatar }
    const validationResult = zUserCreationServerSchema.safeParse(body)
    if (!validationResult.success) {
      return Response.json(
        {
          message: 'Invalid Data',
          error: validationResult.error.formErrors.fieldErrors,
        },
        { status: 422 }
      )
    }

    await DbConnect()

    const isUser = await UserModel.exists({
      username: validationResult.data.username,
    })
    if (isUser) {
      return Response.json({ message: 'Username already exists' }, { status: 422 })
    }

    const userCount = await UserModel.countDocuments({})
    const isFirstUser = userCount === 0

    const hashedPass = await hashPass(validationResult.data.password)

    let fileUrl: string | undefined = undefined
    if (avatar) {
      const fileName = `avatar-${payload.identifier}-${avatar.name}`
      const arrayBuffer = await avatar.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const command = new PutObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: validationResult.data.avatar.type,
      })
      await s3.send(command)
      fileUrl = `${process.env.LIARA_ENDPOINT_IMAGE}/${fileName}`
    }

    const token = generateAccessToken({ identifier: payload.identifier })
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: 'strict',
    })

    const refreshToken = generateRefreshToken({
      identifier: payload.identifier,
    })
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      sameSite: 'strict',
    })

    const isEmailParsed = zEmailSchema.safeParse({ email: payload.identifier })

    const data = await UserModel.create({
      fullName: validationResult.data.fullName,
      username: validationResult.data.username,
      password: hashedPass,
      phone: isEmailParsed.success ? undefined : payload.identifier,
      email: isEmailParsed.success ? isEmailParsed.data.email : undefined,
      avatar: fileUrl,
      role: isFirstUser ? 'ADMIN' : 'USER',
      refreshToken,
    })

    cookieStore.delete('temporaryToken')

    return Response.json({ message: 'User created successfully', data }, { status: 201 })
  } catch (error: any) {
    return Response.json({ message: 'Server Error', error: error.message }, { status: 500 })
  }
}
