import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import { IGoal } from '@/types/goal'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

export interface ICreateGoalInput {
  title: string
  date?: string
  dueDate?: string
  group?: string
}
export function useCreateGoal() {
  const date = useDateStore((state) => state.date)
  const refresh = useRefresh(['user-goals'])
  return useMutation<IGoal, Error, ICreateGoalInput>({
    mutationKey: ['create-goal'],
    mutationFn: async (payload) => {
      const res = await client.post<IGoal>(endpoints.goals, {
        ...payload,
        date: convertPersianDateToEnglishNumbers(date),
      })
      return res.data
    },
    onSuccess: () => {
      refresh()
      FireToast({ type: 'success', message: 'هدف با موفقیت ایجاد شد' })
    },
  })
}
