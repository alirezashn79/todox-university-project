import { Model, model, models, Schema, Types } from 'mongoose'
export interface IShoppingListModel {
  user: Types.ObjectId
  date: string
  name: string
  quantity?: number
  isPurchased: boolean
  price?: number
  reason?: string
  group?: Types.ObjectId
}

const ShoppingListSchema = new Schema<IShoppingListModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    isPurchased: { type: Boolean, default: false },
    price: { type: Number },
    reason: { type: String },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
  },
  {
    timestamps: true,
  }
)

const ShoppingListModel =
  (models.ShoppingList as Model<IShoppingListModel>) ||
  model<IShoppingListModel>('ShoppingList', ShoppingListSchema)

export default ShoppingListModel

export type IShoppingListSchema = IShoppingListModel & {
  _id: Types.ObjectId
}
