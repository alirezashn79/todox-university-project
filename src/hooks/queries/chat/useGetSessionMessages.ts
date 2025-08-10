import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'
import { ISessionMessage } from './useSendSessionMessage'

interface IProps {
  sessionId?: string
}

export interface IGetUserSessions {
  sessionId: string
  title: string
  messages: ISessionMessage[]
}

export function useGetSessionMessages({ sessionId }: IProps) {
  return useQuery({
    queryKey: ['session-messages', sessionId],
    queryFn: async () => {
      const url = `${endpoints.chatSession}/${sessionId}`
      const res = await client.get<IGetUserSessions>(url)
      return res.data
    },
  })
}
