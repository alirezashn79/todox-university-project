import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IDeleteShoppingListInput {
  id: string
}
export function useDeleteShoppingList() {
  const refresh = useRefresh(['shopping-lists'])
  return useMutation<void, Error, IDeleteShoppingListInput>({
    mutationKey: ['delete-shopping-list'],
    mutationFn: async ({ id }) => {
      await client.delete(`${endpoints.shoppingLists}/${id}`)
    },
    onSuccess: () => {
      refresh()
      FireToast({
        type: 'success',
        message: 'لیست خرید حذف شد',
      })
    },
  })
}
