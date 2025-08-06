import { IDayPlan } from '@/types/dayPlans'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useGetDayPlan(id: string) {
  return useQuery<IDayPlan, AxiosError>({
    queryKey: ['day-plan', id],
    queryFn: async () => {
      const res = await client.get<IDayPlan>(`${endpoints.dayPlans}/${id}`)
      return res.data
    },
    enabled: Boolean(id),
  })
}
