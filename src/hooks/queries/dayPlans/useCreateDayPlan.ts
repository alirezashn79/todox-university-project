import { useRefresh } from '@/hooks/useRefresh'
import { IDayPlan, MoodType } from '@/types/dayPlans'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export interface ICreateDayPlanInput {
  date: string
  important?: string
  notes?: string
  mood: MoodType
}
export function useCreateDayPlan() {
  const refresh = useRefresh(['day-plans'])
  return useMutation<IDayPlan, AxiosError, ICreateDayPlanInput>({
    mutationKey: ['create-day-plan'],
    mutationFn: async (payload) => {
      const res = await client.post<IDayPlan>(endpoints.dayPlans, payload)
      return res.data
    },
    onSuccess: () => {
      refresh()
      FireToast({ type: 'success', message: 'Day Plan با موفقیت ذخیره شد' })
    },
  })
}
