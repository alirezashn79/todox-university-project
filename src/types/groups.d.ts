export interface IGroup {
  _id: string
  name: string
  description?: string
  owner: string
  members: string[]
  inviteCode: string
  createdAt: string
  updatedAt: string
}
