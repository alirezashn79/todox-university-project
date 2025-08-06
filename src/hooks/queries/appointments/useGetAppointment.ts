import { IAppointment } from '@/types/appointments'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

export function useGetAppointment(id: string) {
  return useQuery<IAppointment, Error>({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const res = await client.get<IAppointment>(`${endpoints.appointments}/${id}`)
      return res.data
    },
    enabled: Boolean(id),
  })
}
