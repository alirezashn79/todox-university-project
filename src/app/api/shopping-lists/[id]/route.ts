import { NextResponse } from 'next/server'
import ShoppingListModel from '@/models/ShoppingList'
import GroupModel from '@/models/Group'
import { Types } from 'mongoose'
import { isAuth } from '@/utils/serverHelpers'

type Params = { params: { id: string } }

// GET یک لیست خاص
export async function GET(_req: Request, { params }: Params) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { id } = params
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'invalid list id' }, { status: 400 })
  }

  const list = await ShoppingListModel.findById(id)
    .select('-__v')
    .populate({ path: 'group', select: 'name members' })
    .lean()

  if (!list) {
    return NextResponse.json({ message: 'list not found' }, { status: 404 })
  }

  // دسترسی فقط برای سازنده یا اعضای گروه
  const isMember =
    list.group &&
    Array.isArray((list.group as any).members) &&
    (list.group as any).members.includes(user._id)

  if (list.user.toString() !== user._id && !isMember) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  return NextResponse.json(list)
}

// PATCH ویرایش لیست
export async function PATCH(req: Request, { params }: Params) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { id } = params
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'invalid list id' }, { status: 400 })
  }

  const list = await ShoppingListModel.findById(id)
  if (!list) {
    return NextResponse.json({ message: 'list not found' }, { status: 404 })
  }

  // فقط سازنده می‌تواند ویرایش کند
  if (list.user.toString() !== user._id) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  const body = await req.json()
  const { date, items, group } = body

  if (date !== undefined) {
    list.date = date
  }

  if (Array.isArray(items)) {
    for (const it of items) {
      if (!it.name) {
        return NextResponse.json({ message: 'each item must have a name' }, { status: 400 })
      }
    }
    list.items = items
  }

  // تغییر گروه
  if (group !== undefined) {
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
      list.group = grp._id
    } else {
      list.group = undefined
    }
  }

  await list.save()
  await list.populate({ path: 'group', select: 'name' })
  return NextResponse.json(list)
}

// DELETE یک لیست
export async function DELETE(_req: Request, { params }: Params) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { id } = params
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'invalid list id' }, { status: 400 })
  }

  const list = await ShoppingListModel.findById(id)
  if (!list) {
    return NextResponse.json({ message: 'list not found' }, { status: 404 })
  }

  // ۱) سازنده مجاز به حذف
  if (list.user.toString() === user._id) {
    await list.deleteOne()
    return NextResponse.json({ message: 'list deleted' })
  }

  // ۲) یا اگر مربوط به گروه است و کاربر Owner گروه است
  if (list.group) {
    const grp = await GroupModel.findById(list.group)
    if (grp && grp.owner.toString() === user._id) {
      await list.deleteOne()
      return NextResponse.json({ message: 'list deleted by group owner' })
    }
  }

  return NextResponse.json(
    { message: 'only creator or owning group owner can delete' },
    { status: 403 }
  )
}
