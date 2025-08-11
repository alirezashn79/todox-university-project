import GoalModel from '@/models/Goal'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const body = await req.json()
  const { date, isAchieved } = body

  if (!date || typeof date !== 'string') {
    return NextResponse.json(
      { message: 'date (YYYY-MM-DD) is required and must be a string' },
      { status: 400 }
    )
  }
  if (typeof isAchieved !== 'boolean') {
    return NextResponse.json({ message: 'isDone must be a boolean' }, { status: 400 })
  }

  const result = await GoalModel.updateMany({ user: user._id, date }, { isAchieved })

  return NextResponse.json({
    message: `updated ${result.modifiedCount} goals for date ${date}`,
    modifiedCount: result.modifiedCount,
  })
}
