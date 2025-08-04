import { Model, model, models, Schema, Types } from 'mongoose'

interface IOtpModel {
  code: string
  phone?: string
  email?: string
  expTime: number
  isExpired: boolean
}
const schema = new Schema<IOtpModel>({
  code: {
    type: String,
    required: true,
  },
  phone: String,
  email: String,
  expTime: {
    type: Number,
    required: true,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
})

const otpModel = (models.Otp as Model<IOtpModel>) || model<IOtpModel>('Otp', schema)

export default otpModel

export type IOtpSchema = IOtpModel & {
  _id: Types.ObjectId
}
