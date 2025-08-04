import UserModel from '@/models/User'
import { generateAccessToken } from '@/utils/auth'
import DbConnect from '@/utils/dbConnection'
import { cookies } from 'next/headers'
import { isExpired } from 'react-jwt'

export async function GET() {
  try {
    const cookieStore = cookies()

    const refreshToken = cookieStore.get('refresh-token')

    if (!refreshToken || isExpired(refreshToken.value)) {
      return Response.json(
        { message: 'Unauthorized no cookie' },
        {
          status: 401,
        }
      )
    }

    await DbConnect()

    const result = await UserModel.findOne({ refreshToken }, 'refreshToken phone email')

    if (!result) {
      return Response.json(
        { message: 'Unauthorized no db result' },
        {
          status: 401,
        }
      )
    }

    const newAccessToken = generateAccessToken({
      identifier: result.phone || result.email,
    })

    cookieStore.set('token', newAccessToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    })

    return Response.json(
      { message: 'access token generated successfully' },
      {
        status: 200,
      }
    )
  } catch (error) {
    return Response.json(
      { message: 'Server Error...!', error: error.message },
      {
        status: 500,
      }
    )
  }
}
