import { useRefresh } from '@/hooks/useRefresh'
import { Role } from '@/types/chat'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useMutation } from '@tanstack/react-query'

export interface ISendSessionMessage {
  id: string
  message: string
}

export interface ISessionMessage {
  role: Role
  content: string
  createdAt: string
}

export interface ISendSessionMessageResponse {
  sessionId: string
  messages: ISessionMessage[]
}

export default function useSendSessionMessage() {
  const refreshSessionMessages = useRefresh(['session-messages'])
  return useMutation({
    mutationKey: ['send-session-message'],
    mutationFn: async (payload: ISendSessionMessage) => {
      const url = `${endpoints.chatSession}/${payload.id}`
      const data = {
        role: 'user',
        content: payload.message,
      }
      const res = await client.post<ISendSessionMessageResponse>(url, data)
      return res.data
    },
    onSuccess: () => {
      refreshSessionMessages()
    },
  })
}
