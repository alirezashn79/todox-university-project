import { NextResponse } from 'next/server'
import AppointmentModel from '@/models/Appointment'
import GroupModel from '@/models/Group'
import { Types } from 'mongoose'
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
  const time = url.searchParams.get('time')
  if (date) filter.date = date
  if (time) filter.time = time

  const appointments = await AppointmentModel.find(filter)
    .select('-__v')
    .populate({ path: 'group', select: 'name' })
    .sort({ date: 1, time: 1 })

  return NextResponse.json(appointments)
}

export async function POST(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const body = await req.json()
  const { title, date, time, description, group } = body

  if (!title || !date) {
    return NextResponse.json({ message: 'title and date are required' }, { status: 400 })
  }

  let groupId = null
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
        { message: 'only group owner can assign appointments to group' },
        { status: 403 }
      )
    }
    groupId = grp._id
  }

  const newAppt = await AppointmentModel.create({
    title,
    date,
    time,
    description: description || '',
    user: user._id,
    group: groupId,
  })

  await newAppt.populate({ path: 'group', select: 'name' })

  return NextResponse.json(newAppt, { status: 201 })
}
