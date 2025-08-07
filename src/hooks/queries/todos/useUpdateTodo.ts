import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IProps {
  id: string
  title?: string
  time?: string
  isDone?: boolean
  group?: string
  date?: string
}

export default function useUpdateTodo() {
  const refreshTodos = useRefresh(['user-todos'])
  return useMutation({
    mutationKey: ['update-todo'],
    mutationFn: async (values: IProps) => {
      const { id, ...data } = values
      await client.patch(`${endpoints.todos}/${id}`, { ...data })
    },
    onSuccess: () => {
      refreshTodos()
      FireToast({
        type: 'success',
        message: 'بروزرسانی شد',
      })
    },
  })
}
