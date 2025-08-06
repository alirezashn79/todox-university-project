import { IShoppingList } from '@/types/shoppingList'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

interface IGetShoppingListsFilters {
  date?: string
}
export function useGetUserShoppingLists(filters: IGetShoppingListsFilters = {}) {
  const { date } = filters
  return useQuery<IShoppingList[], Error>({
    queryKey: ['shopping-lists', date],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (date) params.date = date
      const res = await client.get<IShoppingList[]>(endpoints.shoppingLists, { params })
      return res.data
    },
    staleTime: 1000 * 60 * 2,
  })
}
