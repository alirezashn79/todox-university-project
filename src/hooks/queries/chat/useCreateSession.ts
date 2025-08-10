import { useRefresh } from '@/hooks/useRefresh'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export interface ICreateSession {
  title: string
}

export interface ICreateSessionResponse {
  session: {
    id: string
    title: string
    createdAt: string
    updatedAt: string
  }
}

export default function useCreateSession() {
  const refreshSessions = useRefresh(['user-sessions'])
  const router = useRouter()
  return useMutation({
    mutationKey: ['create-session'],
    mutationFn: async (payload: ICreateSession) => {
      const res = await client.post<ICreateSessionResponse & { message: string }>(
        endpoints.chatSession,
        payload
      )
      return res.data.session
    },
    onSuccess: async (response) => {
      refreshSessions()
      router.push(`/ai-assistant/${response.id}`)
    },
  })
}
