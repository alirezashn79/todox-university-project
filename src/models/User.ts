import { Model, model, models, Schema, Types } from 'mongoose'

export type UserRole = 'ADMIN' | 'USER'

export interface IUserModel {
  fullName: string
  phone?: string
  email?: string
  password: string
  username: string
  avatar?: string
  refreshToken?: string
  role?: UserRole
  groups?: Types.ObjectId[]
}

const UserSchema = new Schema<IUserModel>(
  {
    fullName: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    avatar: { type: String },
    refreshToken: { type: String },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
      required: true,
    },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  },
  {
    timestamps: true,
  }
)
const UserModel = (models.User as Model<IUserModel>) || model<IUserModel>('User', UserSchema)
export default UserModel

export type IUserSchema = IUserModel & {
  _id: Types.ObjectId
}
