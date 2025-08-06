import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'
import { IGroupDetail } from './useGetUserGroups'

interface IUpdateGroupInput {
  id: string
  name?: string
  description?: string
}
export function useUpdateGroup() {
  const refreshList = useRefresh(['user-groups'])
  return useMutation<IGroupDetail, Error, IUpdateGroupInput>({
    mutationKey: ['update-group'],
    mutationFn: async ({ id, ...data }) => {
      const res = await client.patch<IGroupDetail>(`${endpoints.groups}/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      refreshList()
      FireToast({ type: 'success', message: 'گروه بروزرسانی شد' })
    },
  })
}
