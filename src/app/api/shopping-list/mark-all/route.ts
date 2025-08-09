import ShoppingListModel from '@/models/ShoppingList'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  // 1. احراز هویت
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  // 2. خواندن body
  const { date, isPurchased } = await req.json()

  // 3. اعتبارسنجی ورودی‌ها
  if (!date || typeof date !== 'string') {
    return NextResponse.json(
      { message: 'date (YYYY-MM-DD) is required and must be a string' },
      { status: 400 }
    )
  }
  if (typeof isPurchased !== 'boolean') {
    return NextResponse.json({ message: 'isPurchased must be a boolean' }, { status: 400 })
  }

  // 4. به‌روزرسانی همهٔ آیتم‌های خرید کاربر در آن تاریخ
  const result = await ShoppingListModel.updateMany({ user: user._id, date }, { isPurchased })

  // 5. پاسخ به کلاینت
  return NextResponse.json({
    message: `updated ${result.modifiedCount} items for date ${date}`,
    modifiedCount: result.modifiedCount,
  })
}
