import { IGroup } from '@/types/groups'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

export interface IGroupDetail extends Omit<IGroup, 'members'> {
  members: {
    _id: string
    fullName: string
    email: string
  }[]
}

export function useGetUserGroups() {
  return useQuery<IGroup[], Error>({
    queryKey: ['user-groups'],
    queryFn: async () => {
      const res = await client.get<IGroup[]>(endpoints.groups)
      return res.data
    },
  })
}
