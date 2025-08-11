import { NextResponse } from 'next/server'
import DayPlanModel from '@/models/DayPlan'
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

  const plan = await DayPlanModel.findById(id).select('-__v').lean()
  if (!plan) {
    return NextResponse.json({ message: 'not found' }, { status: 404 })
  }

  if (plan.user.toString() !== user._id) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  return NextResponse.json(plan)
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

  const plan = await DayPlanModel.findById(id)
  if (!plan) {
    return NextResponse.json({ message: 'not found' }, { status: 404 })
  }

  if (plan.user.toString() !== user._id) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  const body = await req.json()
  const { date, important, isDoneImportant, notes, mood } = body

  if (date && date !== plan.date) {
    const exists = await DayPlanModel.findOne({ user: user._id, date })
    if (exists) {
      return NextResponse.json(
        { message: 'another plan with this date already exists' },
        { status: 409 }
      )
    }
    plan.date = date
  }

  if (important !== undefined) plan.important = important
  if (isDoneImportant !== undefined) plan.isDoneImportant = isDoneImportant
  if (notes !== undefined) plan.notes = notes

  if (mood !== undefined) {
    const allowed = ['AWESOME', 'GOOD', 'FAIR', 'BAD', 'TERRIBLE']
    if (!allowed.includes(mood)) {
      return NextResponse.json({ message: 'invalid mood value' }, { status: 400 })
    }
    plan.mood = mood
  }

  await plan.save()
  return NextResponse.json(plan)
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

  const plan = await DayPlanModel.findById(id)
  if (!plan) {
    return NextResponse.json({ message: 'not found' }, { status: 404 })
  }

  if (plan.user.toString() !== user._id) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  await plan.deleteOne()
  return NextResponse.json({ message: 'deleted' })
}
