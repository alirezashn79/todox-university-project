import { useRefresh } from '@/hooks/useRefresh'
import { IShoppingItem, IShoppingList } from '@/types/shoppingList'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

interface ICreateShoppingListInput {
  date: string
  items?: IShoppingItem[]
  group?: string
}
export function useCreateShoppingList() {
  const refresh = useRefresh(['shopping-lists'])
  return useMutation<IShoppingList, Error, ICreateShoppingListInput>({
    mutationKey: ['create-shopping-list'],
    mutationFn: async (payload) => {
      const res = await client.post<IShoppingList>(endpoints.shoppingLists, payload)
      return res.data
    },
    onSuccess: () => {
      refresh()
      FireToast({
        type: 'success',
        message: 'لیست خرید با موفقیت ایجاد شد',
      })
    },
  })
}
