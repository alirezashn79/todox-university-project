// models/Chat.ts
import { Schema, model, models, Types, Model } from 'mongoose'

interface IMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface IChatSession {
  user: Types.ObjectId
  title: string
  messages: IMessage[]
}

const MessageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ['system', 'user', 'assistant'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false }
)

const ChatSessionSchema = new Schema<IChatSession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, default: 'New Chat' },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
)

export const ChatSession =
  (models.ChatSession as Model<IChatSession & { createdAt: Date; updatedAt: Date }>) ||
  model<IChatSession>('ChatSession', ChatSessionSchema)
