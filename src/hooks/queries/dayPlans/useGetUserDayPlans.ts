import useDateStore from '@/stores/DateStore'
import { IDayPlan } from '@/types/dayPlans'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useGetUserDayPlans() {
  const date = useDateStore((state) => state.date)
  const dateString = convertPersianDateToEnglishNumbers(date)
  return useQuery<IDayPlan[], AxiosError>({
    queryKey: ['day-plans', dateString],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('date', dateString)
      const url = `${endpoints.dayPlans}?${searchParams.toString()}`
      const res = await client.get<IDayPlan[]>(url)
      return res.data
    },
    staleTime: 1000 * 60 * 2, // ۲ دقیقه
  })
}
