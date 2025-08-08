import useDateStore from '@/stores/DateStore'
import { IAppointment } from '@/types/appointments'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

interface IGetAppointmentsFilters {
  time?: string
}
export function useGetUserAppointments({ time }: IGetAppointmentsFilters = {}) {
  const date = useDateStore((state) => state.date)
  const dateString = convertPersianDateToEnglishNumbers(date)

  return useQuery<IAppointment[], Error>({
    queryKey: ['user-appointments', date, time],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('date', dateString)
      if (time) searchParams.append('time', time)
      const url = `${endpoints.appointments}?${searchParams.toString()}`
      const res = await client.get<IAppointment[]>(url)
      return res.data
    },
    staleTime: 1000 * 60 * 2,
  })
}
