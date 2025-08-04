import { Model, model, models, Schema, Types } from 'mongoose'

export type MoodType = 'AWESOME' | 'GOOD' | 'FAIR' | 'BAD' | 'TERRIBLE'

export interface IDayPlanModel {
  user: Types.ObjectId
  date: string
  important?: string
  notes?: string
  mood: MoodType
}

const DayPlanSchema = new Schema<IDayPlanModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    important: { type: String },
    notes: { type: String },
    mood: {
      type: String,
      enum: ['AWESOME', 'GOOD', 'FAIR', 'BAD', 'TERRIBLE'],
      default: 'GOOD',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

DayPlanSchema.index({ user: 1, date: 1 }, { unique: true })

const DayPlanModel =
  (models.DayPlan as Model<IDayPlanModel>) || model<IDayPlanModel>('DayPlan', DayPlanSchema)
export default DayPlanModel

export type IDayPlanSchema = IDayPlanModel & {
  _id: Types.ObjectId
}
