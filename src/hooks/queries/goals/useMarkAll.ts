import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IProps {
  isAchieved: boolean
}

export default function useMarkAllGoals() {
  const date = useDateStore((state) => state.date)
  const refreshGoals = useRefresh(['user-goals'])
  return useMutation({
    mutationKey: ['mark-all-goals', date],
    mutationFn: async (values: IProps) => {
      await client.patch(endpoints.markAllGoals, {
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
