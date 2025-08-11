import ShoppingListModel from '@/models/ShoppingList'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { date, isPurchased } = await req.json()

  if (!date || typeof date !== 'string') {
    return NextResponse.json(
      { message: 'date (YYYY-MM-DD) is required and must be a string' },
      { status: 400 }
    )
  }
  if (typeof isPurchased !== 'boolean') {
    return NextResponse.json({ message: 'isPurchased must be a boolean' }, { status: 400 })
  }

  const result = await ShoppingListModel.updateMany({ user: user._id, date }, { isPurchased })

  return NextResponse.json({
    message: `updated ${result.modifiedCount} items for date ${date}`,
    modifiedCount: result.modifiedCount,
  })
}
