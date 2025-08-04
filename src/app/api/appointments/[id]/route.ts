// app/api/appointments/[id]/route.ts
import { NextResponse } from 'next/server'
import AppointmentModel from '@/models/Appointment'
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

  const appt = await AppointmentModel.findById(id)
    .select('-__v')
    .populate({ path: 'group', select: 'name' })

  if (!appt) {
    return NextResponse.json({ message: 'appointment not found' }, { status: 404 })
  }

  if (
    appt.user.toString() !== user._id &&
    !(
      appt.group &&
      Array.isArray((appt.group as any).members) &&
      (appt.group as any).members.includes(user._id)
    )
  ) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  return NextResponse.json(appt)
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

  const appt = await AppointmentModel.findById(id)
  if (!appt) {
    return NextResponse.json({ message: 'appointment not found' }, { status: 404 })
  }

  if (appt.user.toString() !== user._id) {
    return NextResponse.json({ message: 'access denied' }, { status: 403 })
  }

  const body = await req.json()
  const { title, date, time, description, group } = body

  if (title !== undefined) appt.title = title
  if (date !== undefined) appt.date = date
  if (time !== undefined) appt.time = time
  if (description !== undefined) appt.description = description

  if (group !== undefined) {
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
      appt.group = grp._id
    } else {
      appt.group = undefined
    }
  }

  await appt.save()
  await appt.populate({ path: 'group', select: 'name' })
  return NextResponse.json(appt)
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

  const appt = await AppointmentModel.findById(id)
  if (!appt) {
    return NextResponse.json({ message: 'appointment not found' }, { status: 404 })
  }

  if (appt.user.toString() === user._id) {
    await appt.deleteOne()
    return NextResponse.json({ message: 'appointment deleted' })
  }

  if (appt.group) {
    const grp = await GroupModel.findById(appt.group)
    if (grp && grp.owner.toString() === user._id) {
      await appt.deleteOne()
      return NextResponse.json({ message: 'appointment deleted by group owner' })
    }
  }

  return NextResponse.json(
    { message: 'only appointment creator or owning group owner can delete' },
    { status: 403 }
  )
}
