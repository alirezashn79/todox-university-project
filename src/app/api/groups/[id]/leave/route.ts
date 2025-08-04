import GroupModel from '@/models/Group'
import { isAuth } from '@/utils/serverHelpers'
import { Types } from 'mongoose'
import { NextResponse } from 'next/server'

type Params = { params: { id: string } }

export async function POST(_req: Request, { params }: Params) {
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
  if (group.owner.toString() === user._id) {
    return NextResponse.json(
      { message: 'owner cannot leave group; transfer ownership or delete group first' },
      { status: 400 }
    )
  }

  group.members = group.members.filter((m) => m.toString() !== user._id)
  await group.save()
  return NextResponse.json({ message: 'left group successfully' })
}
