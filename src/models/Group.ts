import { Model, model, models, Schema, Types } from 'mongoose'

export interface IGroupModel {
  name: string
  description?: string
  owner: Types.ObjectId
  members: Types.ObjectId[]
  inviteCode: string
}

const GroupSchema = new Schema<IGroupModel>(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    inviteCode: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
)

const GroupModel = (models.Group as Model<IGroupModel>) || model<IGroupModel>('Group', GroupSchema)
export default GroupModel

export type IGroupSchema = IGroupModel & {
  _id: Types.ObjectId
}
