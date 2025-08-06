import GroupModel from '@/models/Group'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'

export async function POST(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const { inviteCode } = await req.json()
  if (!inviteCode) {
    return NextResponse.json({ message: 'inviteCode is required' }, { status: 400 })
  }

  const group = await GroupModel.findOne({ inviteCode })
  if (!group) {
    return NextResponse.json({ message: 'invalid inviteCode' }, { status: 404 })
  }
  if (group.members.includes(new Types.ObjectId(user._id))) {
    return NextResponse.json({ message: 'already joined' }, { status: 400 })
  }

  group.members.push(new Types.ObjectId(user._id))
  await group.save()
  return NextResponse.json({ message: 'joined successfully', group })
}
