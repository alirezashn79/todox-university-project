// app/api/groups/route.ts
import GroupModel from '@/models/Group'
import { isAuth } from '@/utils/serverHelpers'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }
  const groups = await GroupModel.find({ members: user._id }).select('-__v').sort({ createdAt: -1 })
  return NextResponse.json(groups)
}

export async function POST(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { name, description } = await req.json()
  if (!name) {
    return NextResponse.json({ message: 'name is required' }, { status: 400 })
  }

  const inviteCode = nanoid(8)
  const group = await GroupModel.create({
    name,
    description,
    owner: user._id,
    members: [user._id],
    inviteCode,
  })

  return NextResponse.json(group, { status: 201 })
}
