import { IShoppingList } from '@/types/shoppingList'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

export function useGetShoppingList(id: string) {
  return useQuery<IShoppingList, Error>({
    queryKey: ['shopping-list', id],
    queryFn: async () => {
      const res = await client.get<IShoppingList>(`${endpoints.shoppingLists}/${id}`)
      return res.data
    },
    enabled: Boolean(id),
  })
}
