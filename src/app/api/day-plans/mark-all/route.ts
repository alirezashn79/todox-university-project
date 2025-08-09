import DayPlanModel from '@/models/DayPlan'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  // 1. احراز هویت
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  // 2. خواندن body
  const { date, isDoneImportant } = await req.json()

  // 3. اعتبارسنجی ورودی‌ها
  if (!date || typeof date !== 'string') {
    return NextResponse.json(
      { message: 'date (YYYY-MM-DD) is required and must be a string' },
      { status: 400 }
    )
  }
  if (typeof isDoneImportant !== 'boolean') {
    return NextResponse.json({ message: 'isDoneImportant must be a boolean' }, { status: 400 })
  }

  // 4. به‌روزرسانی همهٔ آیتم‌های خرید کاربر در آن تاریخ
  const result = await DayPlanModel.updateMany({ user: user._id, date }, { isDoneImportant })

  // 5. پاسخ به کلاینت
  return NextResponse.json({
    message: `updated ${result.modifiedCount} items for date ${date}`,
    modifiedCount: result.modifiedCount,
  })
}
