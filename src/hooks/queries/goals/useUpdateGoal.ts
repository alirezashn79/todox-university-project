import { useRefresh } from '@/hooks/useRefresh'
import { IGoal } from '@/types/goal'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IUpdateGoalInput {
  id: string
  title?: string
  isAchieved?: boolean
  date?: string | null
  dueDate?: string | null
  group?: string | null
}
export function useUpdateGoal() {
  const refreshList = useRefresh(['user-goals'])
  const refreshDetail = useRefresh(['goal'])
  return useMutation<IGoal, Error, IUpdateGoalInput>({
    mutationKey: ['update-goal'],
    mutationFn: async ({ id, ...data }) => {
      const res = await client.patch<IGoal>(`${endpoints.goals}/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      refreshList()
      refreshDetail()
      FireToast({ type: 'success', message: 'هدف با موفقیت بروزرسانی شد' })
    },
  })
}
