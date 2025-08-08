import AppointmentModel from '@/models/Appointment'
import GoalModel from '@/models/Goal'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  // 1. احراز هویت
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  // 2. خواندن body
  const body = await req.json()
  const { date, isDone } = body

  // 3. اعتبارسنجی ورودی‌ها
  if (!date || typeof date !== 'string') {
    return NextResponse.json(
      { message: 'date (YYYY-MM-DD) is required and must be a string' },
      { status: 400 }
    )
  }
  if (typeof isDone !== 'boolean') {
    return NextResponse.json({ message: 'isDone must be a boolean' }, { status: 400 })
  }

  // 4. به‌روزرسانی همه‌ی appointments کاربر در آن تاریخ
  const result = await AppointmentModel.updateMany({ user: user._id, date }, { isDone })

  // 5. پاسخ به کلاینت
  return NextResponse.json({
    message: `updated ${result.modifiedCount} appointments for date ${date}`,
    modifiedCount: result.modifiedCount,
  })
}
