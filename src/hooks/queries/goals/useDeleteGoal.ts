import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IDeleteGoalInput {
  id: string
}
export function useDeleteGoal() {
  const refresh = useRefresh(['user-goals'])
  return useMutation<void, Error, IDeleteGoalInput>({
    mutationKey: ['delete-goal'],
    mutationFn: async ({ id }) => {
      await client.delete(`${endpoints.goals}/${id}`)
    },
    onSuccess: () => {
      refresh()
      FireToast({ type: 'success', message: 'هدف حذف شد' })
    },
  })
}
