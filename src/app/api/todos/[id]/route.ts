import { NextResponse } from 'next/server'
import TodoModel from '@/models/Todo'
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

  const todo = await TodoModel.findById(id).select('-__v').populate('group').lean()
  if (!todo) {
    return NextResponse.json({ message: 'not found' }, { status: 404 })
  }

  if (todo.user.toString() !== user._id) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  return NextResponse.json(todo)
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

  const todo = await TodoModel.findById(id)
  if (!todo) {
    return NextResponse.json({ message: 'not found' }, { status: 404 })
  }

  if (todo.user.toString() !== user._id) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  const body = await req.json()
  const { title, date, time, group, isDone } = body

  if (title !== undefined) todo.title = title
  if (date !== undefined) todo.date = date
  if (time !== undefined) todo.time = time

  if (group !== undefined) {
    if (group && !Types.ObjectId.isValid(group)) {
      return NextResponse.json({ message: 'invalid group id' }, { status: 400 })
    }
    todo.group = group ? new Types.ObjectId(group) : undefined
  }

  if (isDone !== undefined) {
    todo.isDone = Boolean(isDone)
  }

  await todo.save()
  return NextResponse.json(todo)
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

  const todo = await TodoModel.findById(id)
  if (!todo) {
    return NextResponse.json({ message: 'not found' }, { status: 404 })
  }

  if (todo.user.toString() !== user._id) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  await todo.deleteOne()
  return NextResponse.json({ message: 'deleted' })
}
