import GoalModel from '@/models/Goal'
import GroupModel from '@/models/Group'
import { isAuth } from '@/utils/serverHelpers'
import { Types } from 'mongoose'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  // 1) یافتن گروه‌های کاربر
  const userGroups = await GroupModel.find({ members: user._id }).select('_id').lean()
  const groupIds = userGroups.map((g) => g._id)

  // 2) ساخت فیلتر برای اهداف شخصی و اهداف گروهی
  const filter: any = {
    $or: [{ user: user._id }, { group: { $in: groupIds } }],
  }

  // ۳) در صورت ارسال پارامترهای تاریخ، آن‌ها را هم اضافه می‌کنیم
  const url = new URL(req.url)
  const date = url.searchParams.get('date')
  const dueDate = url.searchParams.get('dueDate')
  if (date) filter.date = date
  if (dueDate) filter.dueDate = dueDate

  // ۴) کوئری و بازگردانی با populate روی فیلد group برای دریافت name
  const goals = await GoalModel.find(filter)
    .select('-__v')
    .populate({ path: 'group', select: 'name' })
    .sort({ createdAt: -1 })

  return NextResponse.json(goals)
}

export async function POST(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { title, date, dueDate, group } = await req.json()
  if (!title) {
    return NextResponse.json({ message: 'title is required' }, { status: 400 })
  }

  const payload: any = { title, user: user._id, isAchieved: false }
  if (date) payload.date = date
  if (dueDate) payload.dueDate = dueDate

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
        { message: 'only group owner can assign a goal to this group' },
        { status: 403 }
      )
    }
    payload.group = group
  }

  const newGoal = await GoalModel.create(payload)
  return NextResponse.json(newGoal, { status: 201 })
}
