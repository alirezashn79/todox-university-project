import TodoModel from '@/models/Todo'
import DbConnect from '@/utils/dbConnection'
import { isAuth } from '@/utils/serverHelpers'

export async function POST(request: Request) {
  try {
    const user = await isAuth()

    if (!user) {
      return Response.json({ message: 'please login' }, { status: 401 })
    }

    const reqBody: {
      date: string
      isDone: boolean
      title: string
      time: string
      user: string
    }[] = await request.json()

    reqBody.forEach((item) => {
      item.user = user._id
    })

    await DbConnect()

    await TodoModel.insertMany(reqBody)

    return Response.json({ message: 'all todos inserted' })
  } catch (error) {
    return Response.json(
      { message: 'Server Error' },
      {
        status: 500,
      }
    )
  }
}
