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

  // پیدا کردن گروه‌هایی که کاربر عضوشان است
  const userGroups = await GroupModel.find({ members: user._id }).select('_id').lean()
  const groupIds = userGroups.map((g) => g._id)

  // ساخت فیلتر برای قرارهای شخصی و گروهی
  const filter: any = {
    $or: [{ user: user._id }, { group: { $in: groupIds } }],
  }

  // فیلتر اختیاری بر اساس date و time
  const url = new URL(req.url)
  const date = url.searchParams.get('date')
  const time = url.searchParams.get('time')
  if (date) filter.date = date
  if (time) filter.time = time

  // اجرای کوئری و populate گروه برای دریافت name
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

  // عنوان و تاریخ اجباری هستند
  if (!title || !date) {
    return NextResponse.json({ message: 'title and date are required' }, { status: 400 })
  }

  let groupId = null
  if (group) {
    // اعتبارسنجی ObjectId
    if (!Types.ObjectId.isValid(group)) {
      return NextResponse.json({ message: 'invalid group id' }, { status: 400 })
    }
    const grp = await GroupModel.findById(group)
    if (!grp) {
      return NextResponse.json({ message: 'group not found' }, { status: 404 })
    }
    // تنها Owner گروه می‌تواند قرار را به گروه اختصاص دهد
    if (grp.owner.toString() !== user._id) {
      return NextResponse.json(
        { message: 'only group owner can assign appointments to group' },
        { status: 403 }
      )
    }
    groupId = grp._id
  }

  // ایجاد Appointment جدید
  const newAppt = await AppointmentModel.create({
    title,
    date,
    time,
    description: description || '',
    user: user._id,
    group: groupId,
  })

  // Populate برای پاسخ
  await newAppt.populate({ path: 'group', select: 'name' })

  return NextResponse.json(newAppt, { status: 201 })
}
