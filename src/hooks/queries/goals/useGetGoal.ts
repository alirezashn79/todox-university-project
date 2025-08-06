import { IGoal } from '@/types/goal'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

export function useGetGoal(id: string) {
  return useQuery<IGoal, Error>({
    queryKey: ['goal', id],
    queryFn: async () => {
      const res = await client.get<IGoal>(`${endpoints.goals}/${id}`)
      return res.data
    },
    enabled: Boolean(id),
  })
}
