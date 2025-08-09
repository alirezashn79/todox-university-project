import { useRefresh } from '@/hooks/useRefresh'
import { IShoppingItem } from '@/types/shoppingList'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

export interface IUpdateShoppingItemInput {
  id: string
  date?: string | null
  name?: string
  quantity?: number | null
  isPurchased?: boolean
  price?: number | null
  reason?: string | null
  group?: string | null
}

export function useUpdateShoppingItem() {
  const refreshList = useRefresh(['user-shopping-list'])
  const refreshItem = useRefresh(['shopping-item'])

  return useMutation<IShoppingItem, Error, IUpdateShoppingItemInput>({
    mutationKey: ['update-shopping-item'],
    mutationFn: async ({ id, ...data }) => {
      const res = await client.patch<IShoppingItem>(`${endpoints.shoppingList}/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      refreshList()
      refreshItem()
      FireToast({ type: 'success', message: 'آیتم با موفقیت بروزرسانی شد' })
    },
  })
}
