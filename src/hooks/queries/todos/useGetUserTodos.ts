import { ITodoSchema } from '@/models/Todo'
import useDateStore from '@/stores/DateStore'
import client from '@/utils/client'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

export default function useGetUserTodos() {
  const date = useDateStore((state) => state.date)
  return useQuery({
    queryKey: ['user-todos', date],
    queryFn: async ({ queryKey }) => {
      const date = queryKey[1] as string
      const searchParams = new URLSearchParams()
      searchParams.append('date', date)
      const url = `${endpoints.todos}?${searchParams.toString()}`
      const res = await client.get<ITodoSchema>(url)

      return res.data
    },
  })
}
