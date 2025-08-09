import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import ShoppingListModel from '@/models/ShoppingList'
import GroupModel from '@/models/Group'
import { isAuth } from '@/utils/serverHelpers'

export async function GET(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  // 1) بیابیم گروه‌هایی که کاربر عضو آن‌هاست
  const userGroups = await GroupModel.find({ members: user._id }).select('_id').lean()
  const groupIds = userGroups.map((g) => g._id)

  // 2) فیلتر روی آیتم‌های شخصی یا گروهی
  const filter: any = {
    $or: [{ user: user._id }, { group: { $in: groupIds } }],
  }

  // 3) فیلتر اختیاری بر اساس تاریخ
  const url = new URL(req.url)
  const date = url.searchParams.get('date')
  if (date) {
    filter.date = date
  }

  // 4) خروجی
  const items = await ShoppingListModel.find(filter)
    .select('-__v')
    .populate({ path: 'group', select: 'name' })
    .sort({ createdAt: -1 })

  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { date, name, quantity, isPurchased, price, reason, group } = await req.json()

  // فیلدهای الزامی
  if (!date || !name) {
    return NextResponse.json({ message: 'date and name are required' }, { status: 400 })
  }

  // بارگذاری اولیه‌ی payload
  const payload: any = {
    user: user._id,
    date,
    name,
    quantity,
    isPurchased,
    price,
    reason,
  }

  // اگر گروه ارسال شده باشد، اعتبارسنجی کنیم
  if (group) {
    if (!Types.ObjectId.isValid(group)) {
      return NextResponse.json({ message: 'invalid group id' }, { status: 400 })
    }
    const grp = await GroupModel.findById(group)
    if (!grp) {
      return NextResponse.json({ message: 'group not found' }, { status: 404 })
    }
    // در اینجا فرض کردیم تنها مالک گروه می‌تواند آیتم را به گروه اضافه کند
    if (grp.owner.toString() !== user._id) {
      return NextResponse.json(
        { message: 'only group owner can add item to this group' },
        { status: 403 }
      )
    }
    payload.group = group
  }

  const newItem = await ShoppingListModel.create(payload)
  return NextResponse.json(newItem, { status: 201 })
}
