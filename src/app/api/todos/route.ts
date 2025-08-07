import { NextResponse } from 'next/server'
import TodoModel from '@/models/Todo'
import { Types } from 'mongoose'
import { isAuth } from '@/utils/serverHelpers'

export async function GET(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const url = new URL(req.url)
  const dateFilter = url.searchParams.get('date')
  const groupFilter = url.searchParams.get('group')

  const filter: any = { user: user._id }
  if (dateFilter) filter.date = dateFilter
  if (groupFilter && Types.ObjectId.isValid(groupFilter)) {
    filter.group = groupFilter
  }

  const todos = await TodoModel.find(filter)
    .select('-__v')
    .populate('group')
    .sort({ createdAt: -1, time: 1 })

  return NextResponse.json(todos)
}

export async function POST(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const body = await req.json()
  const { title, date, time, group } = body

  if (!title || !date) {
    return NextResponse.json({ message: 'title and date are required' }, { status: 400 })
  }

  // در صورت وجود گروه، بررسی صحت ObjectId
  let groupId: Types.ObjectId | undefined
  if (group) {
    if (!Types.ObjectId.isValid(group)) {
      return NextResponse.json({ message: 'invalid group id' }, { status: 400 })
    }
    groupId = new Types.ObjectId(group)
  }

  try {
    const newTodo = await TodoModel.create({
      title,
      date,
      time: time ?? null,
      user: user._id,
      group: groupId,
    })
    return NextResponse.json(newTodo, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'internal server error' }, { status: 500 })
  }
}
