import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IProps {
  id: string
}

export default function useUpdateTodo() {
  const refreshTodos = useRefresh(['user-todos'])
  return useMutation({
    mutationKey: ['delete-todo'],
    mutationFn: async (values: IProps) => {
      const { id } = values
      await client.delete(`${endpoints.todos}/${id}`)
    },
    onSuccess: () => {
      refreshTodos()
      FireToast({
        type: 'success',
        message: 'حذف شد',
      })
    },
  })
}
