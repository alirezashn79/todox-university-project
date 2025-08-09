import { useRefresh } from '@/hooks/useRefresh'
import { IDayPlan, MoodType } from '@/types/dayPlans'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export interface IUpdateDayPlanInput {
  id: string
  important?: string | null
  isDoneImportant?: boolean | null
  notes?: string | null
  mood?: MoodType | null
}
export function useUpdateDayPlan() {
  const refreshList = useRefresh(['day-plans'])
  const refreshDetail = useRefresh(['day-plan'])
  return useMutation<IDayPlan, AxiosError, IUpdateDayPlanInput>({
    mutationKey: ['update-day-plan'],
    mutationFn: async ({ id, ...data }) => {
      const res = await client.patch<IDayPlan>(`${endpoints.dayPlans}/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      refreshList()
      refreshDetail()
      FireToast({ type: 'success', message: 'Day Plan با موفقیت به‌روز شد' })
    },
  })
}
