import { NextResponse } from 'next/server'
import { isAuth } from '@/utils/serverHelpers'
import { ChatSession } from '@/models/ChatSession'
import { liaraClient } from '@/libs/ai'
import { Role, ChatContent } from '@/types/chat'

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { sessionId } = params
  const session = await ChatSession.findOne({
    _id: sessionId,
    user: user._id,
  }).lean()

  if (!session) {
    return NextResponse.json({ message: 'Session not found' }, { status: 404 })
  }

  const messages = session.messages.map((m) => ({
    role: m.role,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  }))

  return NextResponse.json({ sessionId, title: session.title, messages })
}

export async function POST(req: Request, { params }: { params: { sessionId: string } }) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { sessionId } = params
  const { role, content } = (await req.json()) as {
    role: Role
    content: ChatContent
  }

  if (!role || !content) {
    return NextResponse.json({ message: 'role and content are required' }, { status: 400 })
  }

  const session = await ChatSession.findOne({
    _id: sessionId,
    user: user._id,
  })
  if (!session) {
    return NextResponse.json({ message: 'Session not found' }, { status: 404 })
  }

  session.messages.push({ role, content, createdAt: new Date() })
  await session.save()

  const history = session.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  const completion = await liaraClient.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    messages: history,
  })
  const assistantMsg = completion.choices[0].message!

  session.messages.push({
    role: assistantMsg.role as Role,
    content: assistantMsg.content as ChatContent,
    createdAt: new Date(),
  })
  await session.save()

  const messages = session.messages.map((m) => ({
    role: m.role,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  }))
  return NextResponse.json({ sessionId, messages })
}

export async function DELETE(req: Request, { params }: { params: { sessionId: string } }) {
  const user = await isAuth()
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { sessionId } = params
  const del = await ChatSession.findOneAndDelete({
    _id: sessionId,
    user: user._id,
  })
  if (!del) {
    return NextResponse.json({ message: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Session deleted' }, { status: 200 })
}
