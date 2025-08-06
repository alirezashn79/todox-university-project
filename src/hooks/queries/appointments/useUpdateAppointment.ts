import { useRefresh } from '@/hooks/useRefresh'
import { IAppointment } from '@/types/appointments'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IUpdateAppointmentInput {
  id: string
  title?: string
  date?: string
  time?: string
  description?: string | null
  group?: string | null
}
export function useUpdateAppointment() {
  const refreshList = useRefresh(['user-appointments'])
  const refreshDetail = useRefresh(['appointment'])
  return useMutation<IAppointment, Error, IUpdateAppointmentInput>({
    mutationKey: ['update-appointment'],
    mutationFn: async ({ id, ...data }) => {
      const res = await client.patch<IAppointment>(`${endpoints.appointments}/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      refreshList()
      refreshDetail()
      FireToast({
        type: 'success',
        message: 'قرار با موفقیت به‌روز شد',
      })
    },
  })
}
