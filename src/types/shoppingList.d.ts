export interface IShoppingItem {
  _id: string
  user: string
  date: string
  name: string
  quantity?: number
  isPurchased: boolean
  price?: number
  reason?: string
  group?:
    | string
    | {
        _id: string
        name: string
      }
  createdAt?: string
  updatedAt?: string
}
