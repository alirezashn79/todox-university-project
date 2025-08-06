export interface IGoal {
  _id: string
  title: string
  user: string
  isAchieved: boolean
  date?: string
  dueDate?: string
  group?: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}
