import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export interface IDeleteDayPlanInput {
  id: string
}
export function useDeleteDayPlan() {
  const refresh = useRefresh(['day-plans'])
  return useMutation<void, AxiosError, IDeleteDayPlanInput>({
    mutationKey: ['delete-day-plan'],
    mutationFn: async ({ id }) => {
      await client.delete(`${endpoints.dayPlans}/${id}`)
    },
    onSuccess: () => {
      refresh()
      FireToast({ type: 'success', message: 'Day Plan حذف شد' })
    },
  })
}
