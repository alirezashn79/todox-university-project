export interface IAppointment {
  _id: string
  title: string
  description?: string
  date: string
  time: string
  user: string
  isDone: boolean
  group?: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}
