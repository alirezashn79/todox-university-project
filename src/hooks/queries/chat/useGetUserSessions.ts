import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

export interface ISession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface IGetUserSessions {
  sessions: ISession[]
}

export function useGetUserSessions() {
  return useQuery({
    queryKey: ['user-sessions'],
    queryFn: async () => {
      const res = await client.get<IGetUserSessions>(endpoints.chatSession)
      return res.data.sessions
    },
  })
}
