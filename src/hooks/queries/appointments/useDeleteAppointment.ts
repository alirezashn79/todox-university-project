import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IDeleteAppointmentInput {
  id: string
}
export function useDeleteAppointment() {
  const refresh = useRefresh(['user-appointments'])
  return useMutation<void, Error, IDeleteAppointmentInput>({
    mutationKey: ['delete-appointment'],
    mutationFn: async ({ id }) => {
      await client.delete(`${endpoints.appointments}/${id}`)
    },
    onSuccess: () => {
      refresh()
      FireToast({
        type: 'success',
        message: 'قرار حذف شد',
      })
    },
  })
}
