import { model, models, Schema } from 'mongoose'

type UserRole = 'ADMIN' | 'USER'

interface IUserModel {
  fullName: string
  phone?: string
  email?: string
  password: string
  username: string
  avatar?: string
  refreshToken?: string
  role?: UserRole
}

const schema = new Schema<IUserModel>({
  fullName: {
    type: String,
    required: true,
  },
  phone: String,
  email: String,
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: String,
  refreshToken: String,
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER',
    required: true,
  },
})

const UserModel = models.User || model<IUserModel>('User', schema)

export default UserModel
