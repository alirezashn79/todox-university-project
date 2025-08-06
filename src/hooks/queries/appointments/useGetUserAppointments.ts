import { IAppointment } from '@/types/appointments'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

interface IGetAppointmentsFilters {
  date?: string
  time?: string
}
export function useGetUserAppointments(filters: IGetAppointmentsFilters = {}) {
  const { date, time } = filters
  return useQuery<IAppointment[], Error>({
    queryKey: ['user-appointments', date, time],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (date) params.date = date
      if (time) params.time = time
      const res = await client.get<IAppointment[]>(endpoints.appointments, { params })
      return res.data
    },
    staleTime: 1000 * 60 * 2,
  })
}
