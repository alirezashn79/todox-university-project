import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

export interface IDeleteShoppingItemInput {
  id: string
}

export function useDeleteShoppingItem() {
  const refresh = useRefresh(['user-shopping-list'])

  return useMutation<void, Error, IDeleteShoppingItemInput>({
    mutationKey: ['delete-shopping-item'],
    mutationFn: async ({ id }) => {
      await client.delete(`${endpoints.shoppingList}/${id}`)
    },
    onSuccess: () => {
      refresh()
      FireToast({ type: 'success', message: 'آیتم حذف شد' })
    },
  })
}
