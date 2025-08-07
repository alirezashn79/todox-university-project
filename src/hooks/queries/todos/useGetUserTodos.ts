import { ITodoSchema } from '@/models/Todo'
import useDateStore from '@/stores/DateStore'
import client from '@/utils/client'
import {
  convertPersianDateToEnglishNumbers,
  convertToPersianTimeWithEnglishNumbers,
} from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { useQuery } from '@tanstack/react-query'

export default function useGetUserTodos() {
  const date = useDateStore((state) => state.date)
  const dateString = convertPersianDateToEnglishNumbers(date)
  return useQuery({
    queryKey: ['user-todos', dateString],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('date', dateString)
      const url = `${endpoints.todos}?${searchParams.toString()}`
      const res = await client.get<ITodoSchema[]>(url)

      return res.data
    },
  })
}
