import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IDeleteGroupInput {
  id: string
}
export function useDeleteGroup() {
  const refreshList = useRefresh(['user-groups'])
  return useMutation<void, Error, IDeleteGroupInput>({
    mutationKey: ['delete-group'],
    mutationFn: async ({ id }) => {
      await client.delete(`${endpoints.groups}/${id}`)
    },
    onSuccess: () => {
      refreshList()
      FireToast({ type: 'success', message: 'گروه حذف شد' })
    },
  })
}
