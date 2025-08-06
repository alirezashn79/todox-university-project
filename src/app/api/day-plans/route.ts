// app/api/day-plans/route.ts
import DayPlanModel from '@/models/DayPlan'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  // می‌توانید با ?date=YYYY-MM-DD فیلتر کنید
  const url = new URL(req.url)
  const dateFilter = url.searchParams.get('date')

  const filter: any = { user: user._id }
  if (dateFilter) {
    filter.date = dateFilter
  }

  const plans = await DayPlanModel.find(filter).select('-__v').sort({ date: -1 })

  return NextResponse.json(plans)
}

export async function POST(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'please login' }, { status: 401 })
  }

  const body = await req.json()
  const { date, important, notes, mood } = body

  // date و mood اجباری‌اند
  if (!date) {
    return NextResponse.json({ message: 'date and mood are required' }, { status: 400 })
  }

  // اعتبارسنجی مقدار mood
  const allowedMoods = ['AWESOME', 'GOOD', 'FAIR', 'BAD', 'TERRIBLE']
  if (mood && !allowedMoods.includes(mood)) {
    return NextResponse.json({ message: 'invalid mood value' }, { status: 400 })
  }

  try {
    const isDayPlanExist = await DayPlanModel.exists({ user: user._id, date })

    if (isDayPlanExist) {
      const updatedDayPlan = await DayPlanModel.findByIdAndUpdate(isDayPlanExist._id, {
        ...(important && { important }),
        ...(notes && { notes }),
        ...(mood && { mood }),
        user: user._id,
        date,
      })
      return NextResponse.json(updatedDayPlan, { status: 201 })
    }
    const newPlan = await DayPlanModel.create({
      user: user._id,
      date,
      important: important ?? null,
      notes: notes ?? null,
      mood,
    })

    return NextResponse.json(newPlan, { status: 201 })
  } catch (err: any) {
    // در صورت duplicate date برای همان کاربر
    if (err.code === 11000) {
      return NextResponse.json(
        { message: 'day plan for this date already exists' },
        { status: 409 }
      )
    }
    console.error(err)
    return NextResponse.json({ message: 'internal server error' }, { status: 500 })
  }
}
