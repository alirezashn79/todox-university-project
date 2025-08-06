import { useRefresh } from '@/hooks/useRefresh'
import { IAppointment } from '@/types/appointments'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface ICreateAppointmentInput {
  title: string
  date: string
  time: string
  description?: string
  group?: string
}
export function useCreateAppointment() {
  const refresh = useRefresh(['user-appointments'])
  return useMutation<IAppointment, Error, ICreateAppointmentInput>({
    mutationKey: ['create-appointment'],
    mutationFn: async (payload) => {
      const res = await client.post<IAppointment>(endpoints.appointments, payload)
      return res.data
    },
    onSuccess: () => {
      refresh()
      FireToast({
        type: 'success',
        message: 'قرار با موفقیت ساخته شد',
      })
    },
  })
}
