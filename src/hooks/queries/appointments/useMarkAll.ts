import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IProps {
  isDone: boolean
}

export default function useMarkAllAppointments() {
  const date = useDateStore((state) => state.date)
  const refreshGoals = useRefresh(['user-appointments'])
  return useMutation({
    mutationKey: ['mark-all-appointments', date],
    mutationFn: async (values: IProps) => {
      await client.patch(endpoints.markAllAppointment, {
        ...values,
        date: convertPersianDateToEnglishNumbers(date),
      })
    },
    onSuccess: () => {
      refreshGoals()
      FireToast({
        type: 'success',
        message: 'ثبت شد',
      })
    },
  })
}
