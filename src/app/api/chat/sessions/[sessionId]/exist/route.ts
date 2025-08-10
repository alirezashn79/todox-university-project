import { ChatSession } from '@/models/ChatSession'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  const { sessionId } = params

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    return NextResponse.json({ message: 'SessionId is not valid' }, { status: 400 })
  }

  const session = await ChatSession.exists({
    _id: sessionId,
  })

  if (!session) {
    return NextResponse.json({ message: 'Session not found' }, { status: 404 })
  }
  return NextResponse.json({ id: session._id })
}
