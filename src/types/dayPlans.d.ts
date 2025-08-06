export type MoodType = 'AWESOME' | 'GOOD' | 'FAIR' | 'BAD' | 'TERRIBLE'

export interface IDayPlan {
  _id: string
  user: string
  date: string
  important?: string | null
  notes?: string | null
  mood?: MoodType | null
  createdAt: string
  updatedAt: string
}
