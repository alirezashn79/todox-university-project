import DayPlanModel from '@/models/DayPlan'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { date, isDoneImportant } = await req.json()

  if (!date || typeof date !== 'string') {
    return NextResponse.json(
      { message: 'date (YYYY-MM-DD) is required and must be a string' },
      { status: 400 }
    )
  }
  if (typeof isDoneImportant !== 'boolean') {
    return NextResponse.json({ message: 'isDoneImportant must be a boolean' }, { status: 400 })
  }

  const result = await DayPlanModel.updateMany({ user: user._id, date }, { isDoneImportant })

  return NextResponse.json({
    message: `updated ${result.modifiedCount} items for date ${date}`,
    modifiedCount: result.modifiedCount,
  })
}
