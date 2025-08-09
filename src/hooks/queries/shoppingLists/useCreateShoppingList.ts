import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import { IShoppingItem } from '@/types/shoppingList'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

export interface ICreateShoppingItemInput {
  name: string
  quantity?: number
  price?: number
  reason?: string
  group?: string
}

export function useCreateShoppingItem() {
  const date = useDateStore((state) => state.date)
  const refresh = useRefresh(['user-shopping-list'])

  return useMutation<IShoppingItem, Error, ICreateShoppingItemInput>({
    mutationKey: ['create-shopping-item'],
    mutationFn: async (payload) => {
      const body = {
        ...payload,
        date: convertPersianDateToEnglishNumbers(date),
      }
      const res = await client.post<IShoppingItem>(endpoints.shoppingList, body)
      return res.data
    },
    onSuccess: () => {
      refresh()
      FireToast({ type: 'success', message: 'آیتم با موفقیت اضافه شد' })
    },
  })
}
