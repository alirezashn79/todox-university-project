export interface IShoppingItem {
  name: string
  quantity?: number
  isPurchased: boolean
  price?: number
  reason?: string
}
export interface IShoppingList {
  _id: string
  user: string
  date: string
  items: IShoppingItem[]
  group?: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}
