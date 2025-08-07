import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import client from '@/utils/client'
import {
  convertPersianDateToEnglishNumbers,
  convertToPersianTimeWithEnglishNumbers,
} from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IProps {
  isDone: boolean
}

export default function useMarkAll() {
  const date = useDateStore((state) => state.date)
  const refreshTodos = useRefresh(['user-todos'])
  return useMutation({
    mutationKey: ['mark-all-todos', date],
    mutationFn: async (values: IProps) => {
      await client.patch(endpoints.markAllTodos, {
        ...values,
        date: convertPersianDateToEnglishNumbers(date),
      })
    },
    onSuccess: () => {
      refreshTodos()
      FireToast({
        type: 'success',
        message: 'ثبت شد',
      })
    },
  })
}
