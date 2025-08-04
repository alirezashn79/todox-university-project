import { Model, model, models, Schema, Types } from 'mongoose'

export interface ITodoModel {
  title: string
  isDone: boolean
  user: Types.ObjectId
  date: string
  time?: string
  group?: Types.ObjectId
}

const TodoSchema = new Schema<ITodoModel>(
  {
    title: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    time: { type: String },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
  },
  {
    timestamps: true,
  }
)

const TodoModel = (models.Todo as Model<ITodoModel>) || model<ITodoModel>('Todo', TodoSchema)
export default TodoModel

export type ITodoSchema = ITodoModel & {
  _id: Types.ObjectId
}
