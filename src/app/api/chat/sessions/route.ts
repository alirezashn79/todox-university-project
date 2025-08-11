import { ChatSession } from '@/models/ChatSession'
import { isAuth } from '@/utils/serverHelpers'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const sessions = await ChatSession.find({ user: user._id }).sort({ updatedAt: -1 }).lean()

  const data = sessions.map((s) => ({
    id: s._id.toString(),
    title: s.title,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }))

  return NextResponse.json({ sessions: data })
}

export async function POST(req: Request) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

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
