import { useRefresh } from '@/hooks/useRefresh'
import { IGroup } from '@/types/groups'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface ICreateGroupInput {
  name: string
  description?: string
}
export function useCreateGroup() {
  const refresh = useRefresh(['user-groups'])
  return useMutation<IGroup, Error, ICreateGroupInput>({
    mutationKey: ['create-group'],
    mutationFn: async (payload) => {
      const res = await client.post<IGroup>(endpoints.groups, payload)
      return res.data
    },
    onSuccess: () => {
      refresh()
      FireToast({ type: 'success', message: 'گروه ایجاد شد' })
    },
  })
}
