// hooks/useGetUserShoppingItems.ts
import useDateStore from '@/stores/DateStore'
import { IShoppingItem } from '@/types/shoppingList'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

export interface IGetShoppingItemsFilters {
  group?: string
  isPurchased?: boolean
}

export function useGetUserShoppingItems({ group, isPurchased }: IGetShoppingItemsFilters = {}) {
  const date = useDateStore((state) => state.date)
  const dateString = convertPersianDateToEnglishNumbers(date)

  return useQuery<IShoppingItem[], Error>({
    queryKey: ['user-shopping-list', date, group, isPurchased],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('date', dateString)
      if (group) params.append('group', group)
      if (typeof isPurchased === 'boolean') params.append('isPurchased', String(isPurchased))

      const url = `${endpoints.shoppingList}?${params.toString()}`
      const res = await client.get<IShoppingItem[]>(url)
      return res.data
    },
  })
}
