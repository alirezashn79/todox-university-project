import TodoModel from '@/models/Todo'
import DbConnect from '@/utils/dbConnection'
import { isAuth } from '@/utils/serverHelpers'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await isAuth()

    if (!user) {
      return Response.json(
        { message: 'Unauthorized' },
        {
          status: 401,
        }
      )
    }

    await DbConnect()

    const dbResult = await TodoModel.findOne({ _id: params.id, user: user._id }, 'isDone')

    if (!dbResult) {
      return Response.json(
        { message: 'Todo not found' },
        {
          status: 404,
        }
      )
    }

    await TodoModel.findByIdAndUpdate(dbResult._id, {
      isDone: !dbResult.isDone,
    })

    return Response.json({ message: 'Todo updated successfully' })
  } catch (error) {
    return Response.json(
      { message: 'Server Error', error: error.message },
      {
        status: 500,
      }
    )
  }
}
