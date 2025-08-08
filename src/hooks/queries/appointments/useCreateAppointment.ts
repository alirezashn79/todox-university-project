import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import { IAppointment } from '@/types/appointments'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

export interface ICreateAppointmentInput {
  title: string
  time: string
  description?: string
  group?: string
}
export function useCreateAppointment() {
  const date = useDateStore((state) => state.date)
  const refresh = useRefresh(['user-appointments'])
  return useMutation<IAppointment, Error, ICreateAppointmentInput>({
    mutationKey: ['create-appointment'],
    mutationFn: async (payload) => {
      const res = await client.post<IAppointment>(endpoints.appointments, {
        ...payload,
        date: convertPersianDateToEnglishNumbers(date),
      })
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
