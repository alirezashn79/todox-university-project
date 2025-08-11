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

  const userGroups = await GroupModel.find({ members: user._id }).select('_id').lean()
  const groupIds = userGroups.map((g) => g._id)

  const filter: any = {
    $or: [{ user: user._id }, { group: { $in: groupIds } }],
  }

  const url = new URL(req.url)
  const date = url.searchParams.get('date')
  if (date) {
    filter.date = date
  }

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

  if (!date || !name) {
    return NextResponse.json({ message: 'date and name are required' }, { status: 400 })
  }

  const payload: any = {
    user: user._id,
    date,
    name,
    quantity,
    isPurchased,
    price,
    reason,
  }

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
        { message: 'only group owner can add item to this group' },
        { status: 403 }
      )
    }
    payload.group = group
  }

  const newItem = await ShoppingListModel.create(payload)
  return NextResponse.json(newItem, { status: 201 })
}
