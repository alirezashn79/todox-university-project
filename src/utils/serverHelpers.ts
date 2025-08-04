'use server'
import UserModel from '@/models/User'
import { IUser } from '@/types'
import { cookies } from 'next/headers'
import { decodeToken, isExpired } from 'react-jwt'
import DbConnect from './dbConnection'

export async function isAuth() {
  let user = null
  const cookieStore = cookies()

  const token = cookieStore.get('token')

  if (token && !isExpired(token.value)) {
    const decodedToken = decodeToken<{
      identifier: string
    }>(token.value)
    await DbConnect()

    await UserModel.findOne()
    const userDB = await UserModel.findOne(
      {
        $or: [{ phone: decodedToken?.identifier }, { email: decodedToken?.identifier }],
      },
      'avatar fullName phone username email'
    )
    if (userDB) {
      user = JSON.parse(JSON.stringify(userDB)) as IUser
    }
  }

  return user
}

export async function isAuthPrivate() {
  let user = null
  const cookieStore = cookies()

  const token = cookieStore.get('token')

  if (token && !isExpired(token.value)) {
    const decodedToken = decodeToken<{
      identifier: string
    }>(token.value)

    await DbConnect()

    const userDB = await UserModel.findOne(
      {
        $or: [{ phone: decodedToken?.identifier }, { email: decodedToken?.identifier }],
      },
      'password'
    )
    if (userDB) {
      user = JSON.parse(JSON.stringify(userDB)) as {
        _id: string
        password: string
      }
    }
  }

  return user
}
