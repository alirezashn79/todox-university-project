import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

interface IProps {
  sessionId?: string
}

export interface IGetUserSessions {
  id: string
}

export function useSessionIsExist({ sessionId }: IProps) {
  return useQuery({
    queryKey: ['session-exist', sessionId],
    queryFn: async () => {
      const url = `${endpoints.chatSession}/${sessionId}/exist`
      const res = await client.get<IGetUserSessions>(url)
      return res.data
    },
    enabled: false,
  })
}
