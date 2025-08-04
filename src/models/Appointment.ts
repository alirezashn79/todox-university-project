import { Model, model, models, Schema, Types } from 'mongoose'

export interface IAppointmentModel {
  title: string
  description?: string
  date: string
  time: string
  user: Types.ObjectId
  group?: Types.ObjectId
}

const AppointmentSchema = new Schema<IAppointmentModel>(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
  },
  {
    timestamps: true,
  }
)

const AppointmentModel =
  (models.Appointment as Model<IAppointmentModel>) ||
  model<IAppointmentModel>('Appointment', AppointmentSchema)
export default AppointmentModel

export type IAppointmentSchema = IAppointmentModel & {
  _id: Types.ObjectId
}
