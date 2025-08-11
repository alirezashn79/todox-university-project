import { IShoppingItem } from '@/types/shoppingList'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

export function useGetShoppingItem(id: string) {
  return useQuery<IShoppingItem, Error>({
    queryKey: ['shopping-item', id],
    queryFn: async () => {
      const res = await client.get<IShoppingItem>(`${endpoints.shoppingList}/${id}`)
      return res.data
    },
    enabled: Boolean(id),
  })
}
