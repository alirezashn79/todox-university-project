import useDateStore from '@/stores/DateStore'
import { IGoal } from '@/types/goal'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

interface IGetGoalsFilters {
  dueDate?: string
}
export function useGetUserGoals({ dueDate }: IGetGoalsFilters = {}) {
  const date = useDateStore((state) => state.date)
  const dateString = convertPersianDateToEnglishNumbers(date)
  return useQuery<IGoal[], Error>({
    queryKey: ['user-goals', date, dueDate],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('date', dateString)
      if (dueDate) searchParams.append('dueDate', dueDate)
      const url = `${endpoints.goals}?${searchParams.toString()}`
      const res = await client.get<IGoal[]>(url)
      return res.data
    },
  })
}
