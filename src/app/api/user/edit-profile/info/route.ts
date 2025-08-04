import UserModel from '@/models/User'
import { zEditInfoSchema } from '@/schemas/schema'
import DbConnect from '@/utils/dbConnection'
import { isAuth } from '@/utils/serverHelpers'

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

    const reqBody = await req.json()

    const validationResult = zEditInfoSchema.safeParse(reqBody)

    if (!validationResult.success) {
      return Response.json(
        {
          message: 'invalid data',
          error: validationResult.error.formErrors.fieldErrors,
        },
        {
          status: 422,
        }
      )
    }

    await DbConnect()

    const isUserExist = await UserModel.exists({
      username: validationResult.data.username,
    })

    if (isUserExist) {
      return Response.json(
        { message: 'username already exist' },
        {
          status: 409,
        }
      )
    }

    await UserModel.findByIdAndUpdate(user._id, validationResult.data)

    return Response.json({ message: 'info edited' })
  } catch (error) {
    return Response.json(
      { message: 'Server Error', error: error.message },
      {
        status: 500,
      }
    )
  }
}
