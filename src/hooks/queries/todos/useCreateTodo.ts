import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

export interface ICreateTodo {
  title: string
  time?: string
  isDone?: boolean
  group?: string
}

export default function useCreateTodo() {
  const date = useDateStore((state) => state.date)
  const refreshTodos = useRefresh(['user-todos'])
  return useMutation({
    mutationKey: ['create-todo'],
    mutationFn: async (values: ICreateTodo) => {
      await client.post(endpoints.todos, {
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
