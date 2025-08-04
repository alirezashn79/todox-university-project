import { Model, model, models, Schema, Types } from 'mongoose'

export interface IGoalModel {
  title: string
  isAchieved: boolean
  user: Types.ObjectId
  date?: string
  dueDate?: string
  group?: Types.ObjectId
}

const GoalSchema = new Schema<IGoalModel>(
  {
    title: { type: String, required: true },
    isAchieved: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String },
    dueDate: { type: String },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
  },
  {
    timestamps: true,
  }
)

const GoalModel = (models.Goal as Model<IGoalModel>) || model<IGoalModel>('Goal', GoalSchema)
export default GoalModel

export type IGoalSchema = IGoalModel & {
  _id: Types.ObjectId
}
