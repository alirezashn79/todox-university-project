import { NextResponse } from 'next/server'
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

  const group = await GroupModel.findById(id).populate('members', 'fullName email')
  if (!group) {
    return NextResponse.json({ message: 'group not found' }, { status: 404 })
  }
  if (!group.members.map((m) => m._id.toString()).includes(user._id)) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  return NextResponse.json(group)
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

  const group = await GroupModel.findById(id)
  if (!group) {
    return NextResponse.json({ message: 'group not found' }, { status: 404 })
  }
  if (group.owner.toString() !== user._id) {
    return NextResponse.json({ message: 'only owner can update' }, { status: 403 })
  }

  const { name, description } = await req.json()
  if (name !== undefined) group.name = name
  if (description !== undefined) group.description = description

  await group.save()
  return NextResponse.json(group)
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

  const group = await GroupModel.findById(id)
  if (!group) {
    return NextResponse.json({ message: 'group not found' }, { status: 404 })
  }
  if (group.owner.toString() !== user._id) {
    return NextResponse.json({ message: 'only owner can delete' }, { status: 403 })
  }

  await group.deleteOne()
  return NextResponse.json({ message: 'group deleted' })
}
