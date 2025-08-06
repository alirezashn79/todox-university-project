import { useRefresh } from '@/hooks/useRefresh'
import { IGroup } from '@/types/groups'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IJoinGroupInput {
  inviteCode: string
}
export function useJoinGroup() {
  const refreshList = useRefresh(['user-groups'])
  return useMutation<IGroup, Error, IJoinGroupInput>({
    mutationKey: ['join-group'],
    mutationFn: async (payload) => {
      const res = await client.post<IGroup>(`${endpoints.groups}/join`, payload)
      return res.data
    },
    onSuccess: () => {
      refreshList()
      FireToast({ type: 'success', message: 'به گروه پیوستید' })
    },
  })
}
