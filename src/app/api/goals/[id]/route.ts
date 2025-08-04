// app/api/goals/[id]/route.ts
import { NextResponse } from 'next/server'
import GoalModel from '@/models/Goal'
import GroupModel from '@/models/Group'
import { Types } from 'mongoose'
import { isAuth } from '@/utils/serverHelpers'

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
  const goal = await GoalModel.findById(id).select('-__v')
  if (!goal) {
    return NextResponse.json({ message: 'goal not found' }, { status: 404 })
  }
  if (goal.group) {
    const grp = await GroupModel.findById(goal.group)
    if (!grp?.members.map((m) => m.toString()).includes(user._id)) {
      return NextResponse.json({ message: 'access denied' }, { status: 403 })
    }
  } else if (goal.user.toString() !== user._id) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }
  return NextResponse.json(goal)
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

  const goal = await GoalModel.findById(id)
  if (!goal) {
    return NextResponse.json({ message: 'goal not found' }, { status: 404 })
  }
  if (goal.user.toString() !== user._id) {
    return NextResponse.json({ message: 'only owner can update this goal' }, { status: 403 })
  }

  const { title, isAchieved, date, dueDate, group } = await req.json()
  if (title !== undefined) goal.title = title
  if (isAchieved !== undefined) goal.isAchieved = isAchieved
  if (date !== undefined) goal.date = date
  if (dueDate !== undefined) goal.dueDate = dueDate

  if (group !== undefined) {
    if (group === null) {
      goal.group = undefined
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
          { message: 'only group owner can assign a goal to this group' },
          { status: 403 }
        )
      }
      goal.group = group
    }
  }

  await goal.save()
  return NextResponse.json(goal)
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

  const goal = await GoalModel.findById(id)
  if (!goal) {
    return NextResponse.json({ message: 'goal not found' }, { status: 404 })
  }

  if (goal.user.toString() === user._id) {
    await goal.deleteOne()
    return NextResponse.json({ message: 'goal deleted' })
  }

  if (goal.group) {
    if (!Types.ObjectId.isValid(goal.group.toString())) {
      return NextResponse.json({ message: 'invalid group id' }, { status: 400 })
    }
    const grp = await GroupModel.findById(goal.group)
    if (!grp) {
      return NextResponse.json({ message: 'group not found' }, { status: 404 })
    }
    if (grp.owner.toString() === user._id) {
      await goal.deleteOne()
      return NextResponse.json({ message: 'goal deleted by group owner' })
    }
  }

  return NextResponse.json(
    { message: 'only goal creator or owning group owner can delete this goal' },
    { status: 403 }
  )
}
