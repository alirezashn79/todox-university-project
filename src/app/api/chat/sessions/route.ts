// app/api/chat/sessions/route.ts
import { ChatSession } from '@/models/ChatSession'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'

export async function GET() {
  // ۱. احراز هویت
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // ۲. واکشی سشن‌های کاربر
  const sessions = await ChatSession.find({ user: user._id }).sort({ updatedAt: -1 }).lean()

  // ۳. قالب‌دهی خروجی
  const data = sessions.map((s) => ({
    id: s._id.toString(),
    title: s.title,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }))

  return NextResponse.json({ sessions: data })
}

export async function POST(req: Request) {
  // ۱. احراز هویت
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // ۲. خواندن عنوان سشن از بدنه (اختیاری)
  const { title } = (await req.json()) as { title?: string }
  const session = await ChatSession.create({
    user: user._id,
    title: title || 'New Chat',
    messages: [],
  })

  return NextResponse.json({
    session: {
      id: session._id.toString(),
      title: session.title,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    },
  })
}
