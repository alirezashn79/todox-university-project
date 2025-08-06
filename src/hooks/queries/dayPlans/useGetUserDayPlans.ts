import { IDayPlan } from '@/types/dayPlans'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

interface IGetDayPlansFilters {
  date?: string
}
export function useGetUserDayPlans(filters: IGetDayPlansFilters = {}) {
  const { date } = filters
  return useQuery<IDayPlan[], AxiosError>({
    queryKey: ['day-plans', date],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (date) params.date = date
      const res = await client.get<IDayPlan[]>(endpoints.dayPlans, { params })
      return res.data
    },
    staleTime: 1000 * 60 * 2, // ۲ دقیقه
  })
}
