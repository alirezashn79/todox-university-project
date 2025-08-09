import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IProps {
  isDoneImportant: boolean
}

export default function useMarkAllDayPlans() {
  const date = useDateStore((state) => state.date)
  const refreshGoals = useRefresh(['day-plans'])
  return useMutation({
    mutationKey: ['mark-all-day-plans', date],
    mutationFn: async (values: IProps) => {
      await client.patch(endpoints.markAllDayPlans, {
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
