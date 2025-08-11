import { NextResponse } from 'next/server'
import TodoModel from '@/models/Todo'
import { isAuth } from '@/utils/serverHelpers'

export async function PATCH(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const body = await req.json()
  const { date, isDone } = body

  if (!date || typeof date !== 'string') {
    return NextResponse.json(
      { message: 'date (YYYY-MM-DD) is required and must be a string' },
      { status: 400 }
    )
  }
  if (typeof isDone !== 'boolean') {
    return NextResponse.json({ message: 'isDone must be a boolean' }, { status: 400 })
  }

  const result = await TodoModel.updateMany({ user: user._id, date }, { isDone })

  return NextResponse.json({
    message: `updated ${result.modifiedCount} todos for date ${date}`,
    modifiedCount: result.modifiedCount,
  })
}
