import UserModel from '@/models/User'
import { zEditProfileSchema } from '@/schemas/schema'
import DbConnect from '@/utils/dbConnection'
import { isAuth } from '@/utils/serverHelpers'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { S3 } from 'aws-sdk'
import { s3 } from '@/libs/s3'

export async function PUT(req: Request) {
  try {
    const user = await isAuth()

    if (!user) {
      return Response.json(
        { message: 'please login' },
        {
          status: 401,
        }
      )
    }

    const formData = await req.formData()
    const avatar = formData.get('avatar') as File

    const validationResult = zEditProfileSchema.safeParse({
      avatar,
    })

    if (!validationResult.success) {
      return Response.json(
        {
          message: 'Invalid Date',
          error: validationResult.error.formErrors.fieldErrors,
        },
        {
          status: 422,
        }
      )
    }

    await DbConnect()

    const fileName = `avatar-${user.phone}-${avatar.name}`
    const arrayBuffer = await avatar.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const command = new PutObjectCommand({
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: validationResult.data.avatar.type,
    })

    const response = await s3.send(command)

    const fileUrl = `${process.env.LIARA_ENDPOINT_IMAGE}/${fileName}`

    await UserModel.findByIdAndUpdate(user._id, {
      $set: { avatar: fileUrl },
    })

    return Response.json({ message: 'profile updated' })
  } catch (error) {
    console.log(error)
    return Response.json(
      { message: 'Server Error', error: error.message },
      {
        status: 500,
      }
    )
  }
}
