import { useRefresh } from '@/hooks/useRefresh'
import { IShoppingItem, IShoppingList } from '@/types/shoppingList'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface IUpdateShoppingListInput {
  id: string
  date?: string
  items?: IShoppingItem[]
  group?: string | null
}
export function useUpdateShoppingList() {
  const refreshList = useRefresh(['shopping-lists'])
  const refreshDetail = useRefresh(['shopping-list'])
  return useMutation<IShoppingList, Error, IUpdateShoppingListInput>({
    mutationKey: ['update-shopping-list'],
    mutationFn: async ({ id, ...data }) => {
      const res = await client.patch<IShoppingList>(`${endpoints.shoppingLists}/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      refreshList()
      refreshDetail()
      FireToast({
        type: 'success',
        message: 'لیست خرید با موفقیت به‌روز شد',
      })
    },
  })
}
