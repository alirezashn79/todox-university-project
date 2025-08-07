import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import { IDayPlan, MoodType } from '@/types/dayPlans'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export interface ICreateDayPlanInput {
  important?: string
  notes?: string
  mood: MoodType
}
export function useCreateDayPlan() {
  const refresh = useRefresh(['day-plans'])
  const date = useDateStore((state) => state.date)
  return useMutation<IDayPlan, AxiosError, ICreateDayPlanInput>({
    mutationKey: ['create-day-plan'],
    mutationFn: async (payload) => {
      const res = await client.post<IDayPlan>(endpoints.dayPlans, { ...payload, date })
      return res.data
    },
    onSuccess: () => {
      refresh()
    },
  })
}
