import { IGoal } from '@/types/goal'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

interface IGetGoalsFilters {
  date?: string
  dueDate?: string
}
export function useGetUserGoals(filters: IGetGoalsFilters = {}) {
  const { date, dueDate } = filters
  return useQuery<IGoal[], Error>({
    queryKey: ['user-goals', date, dueDate],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (date) params.date = date
      if (dueDate) params.dueDate = dueDate
      const res = await client.get<IGoal[]>(endpoints.goals, { params })
      return res.data
    },
  })
}
