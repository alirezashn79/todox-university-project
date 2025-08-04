import { NextResponse } from 'next/server'
import ShoppingListModel from '@/models/ShoppingList'
import GroupModel from '@/models/Group'
import { Types } from 'mongoose'
import { isAuth } from '@/utils/serverHelpers'

export async function GET(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  // ۱) پیدا کردن گروه‌هایی که کاربر عضو آنهاست
  const userGroups = await GroupModel.find({ members: user._id }).select('_id').lean()
  const groupIds = userGroups.map((g) => g._id)

  // ۲) ساخت فیلتر: لیست‌های شخصی یا گروهی
  const filter: any = {
    $or: [{ user: user._id }, { group: { $in: groupIds } }],
  }

  // ۳) فیلتر بر اساس date
  const url = new URL(req.url)
  const date = url.searchParams.get('date')
  if (date) {
    filter.date = date
  }

  // ۴) کوئری و populate گروه
  const lists = await ShoppingListModel.find(filter)
    .select('-__v')
    .populate({ path: 'group', select: 'name' })
    .sort({ date: 1, createdAt: -1 })

  return NextResponse.json(lists)
}

export async function POST(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const body = await req.json()
  const { date, items, group } = body

  // date اجباری
  if (!date) {
    return NextResponse.json({ message: 'date is required' }, { status: 400 })
  }

  // اعتبارسنجی و بررسی گروه
  let groupId: Types.ObjectId | undefined
  if (group) {
    if (!Types.ObjectId.isValid(group)) {
      return NextResponse.json({ message: 'invalid group id' }, { status: 400 })
    }
    const grp = await GroupModel.findById(group)
    if (!grp) {
      return NextResponse.json({ message: 'group not found' }, { status: 404 })
    }
    if (grp.owner.toString() !== user._id) {
      return NextResponse.json(
        { message: 'only group owner can assign list to group' },
        { status: 403 }
      )
    }
    groupId = grp._id
  }

  // اگر آیتم اولیه ارسال شده، حداقل name هر کدام چک شود
  if (Array.isArray(items)) {
    for (const it of items) {
      if (!it.name) {
        return NextResponse.json({ message: 'each item must have a name' }, { status: 400 })
      }
    }
  }

  const newList = await ShoppingListModel.create({
    user: user._id,
    date,
    items: Array.isArray(items) ? items : [],
    group: groupId,
  })

  await newList.populate({ path: 'group', select: 'name' })

  return NextResponse.json(newList, { status: 201 })
}
