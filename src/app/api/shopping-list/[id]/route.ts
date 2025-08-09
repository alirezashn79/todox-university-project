import GroupModel from '@/models/Group'
import ShoppingListModel from '@/models/ShoppingList'
import { isAuth } from '@/utils/serverHelpers'
import { Types } from 'mongoose'
import { NextResponse } from 'next/server'

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { id } = params
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'invalid id' }, { status: 400 })
  }

  const item = await ShoppingListModel.findById(id).select('-__v')
  if (!item) {
    return NextResponse.json({ message: 'item not found' }, { status: 404 })
  }

  // دسترسی گروهی: اگر آیتم متعلق به گروه است، کاربر باید عضو گروه باشد
  if (item.group) {
    const grp = await GroupModel.findById(item.group)
    const members = grp?.members.map((m) => m.toString()) || []
    if (!members.includes(user._id)) {
      return NextResponse.json({ message: 'access denied' }, { status: 403 })
    }
  } else {
    // دسترسی شخصی
    if (item.user.toString() !== user._id) {
      return NextResponse.json({ message: 'access denied' }, { status: 403 })
    }
  }

  return NextResponse.json(item)
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { id } = params
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'invalid id' }, { status: 400 })
  }

  const item = await ShoppingListModel.findById(id)
  if (!item) {
    return NextResponse.json({ message: 'item not found' }, { status: 404 })
  }

  // تنها سازنده‌ی آیتم می‌تواند ویرایش کند
  if (item.user.toString() !== user._id) {
    return NextResponse.json({ message: 'only owner can update this item' }, { status: 403 })
  }

  const { date, name, quantity, isPurchased, price, reason, group } = await req.json()

  if (date !== undefined) item.date = date
  if (name !== undefined) item.name = name
  if (quantity !== undefined) item.quantity = quantity
  if (isPurchased !== undefined) item.isPurchased = isPurchased
  if (price !== undefined) item.price = price
  if (reason !== undefined) item.reason = reason

  // تنظیم گروه
  if (group !== undefined) {
    if (group === null) {
      item.group = undefined
    } else {
      if (!Types.ObjectId.isValid(group)) {
        return NextResponse.json({ message: 'invalid group id' }, { status: 400 })
      }
      const grp = await GroupModel.findById(group)
      if (!grp) {
        return NextResponse.json({ message: 'group not found' }, { status: 404 })
      }
      if (grp.owner.toString() !== user._id) {
        return NextResponse.json(
          { message: 'only group owner can assign item to this group' },
          { status: 403 }
        )
      }
      item.group = group
    }
  }

  await item.save()
  return NextResponse.json(item)
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { id } = params
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'invalid id' }, { status: 400 })
  }

  const item = await ShoppingListModel.findById(id)
  if (!item) {
    return NextResponse.json({ message: 'item not found' }, { status: 404 })
  }

  // مالک آیتم می‌تواند حذف کند
  if (item.user.toString() === user._id) {
    await item.deleteOne()
    return NextResponse.json({ message: 'item deleted' })
  }

  // مالک گروه می‌تواند آیتم‌های گروه را حذف کند
  if (item.group) {
    const grp = await GroupModel.findById(item.group)
    if (grp?.owner.toString() === user._id) {
      await item.deleteOne()
      return NextResponse.json({ message: 'item deleted by group owner' })
    }
  }

  return NextResponse.json(
    { message: 'only owner or group owner can delete this item' },
    { status: 403 }
  )
}
