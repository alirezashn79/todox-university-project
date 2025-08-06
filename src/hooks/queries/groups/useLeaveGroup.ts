import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface ILeaveGroupInput {
  id: string
}
export function useLeaveGroup() {
  const refreshList = useRefresh(['user-groups'])
  const refreshDetail = useRefresh(['group'])
  return useMutation<void, Error, ILeaveGroupInput>({
    mutationKey: ['leave-group'],
    mutationFn: async ({ id }) => {
      await client.post(`${endpoints.groups}/${id}/leave`)
    },
    onSuccess: () => {
      refreshList()
      refreshDetail()
      FireToast({ type: 'success', message: 'با موفقیت از گروه خارج شدید' })
    },
  })
}
