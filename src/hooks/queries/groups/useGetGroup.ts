import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'
import { IGroupDetail } from './useGetUserGroups'

export function useGetGroup(id: string) {
  return useQuery<IGroupDetail, Error>({
    queryKey: ['group', id],
    queryFn: async () => {
      const res = await client.get<IGroupDetail>(`${endpoints.groups}/${id}`)
      return res.data
    },
    enabled: Boolean(id),
  })
}
