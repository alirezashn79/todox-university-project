import { QueryKey, useQueryClient } from '@tanstack/react-query'

export function useRefresh(keys: QueryKey | QueryKey[]) {
  const queryClient = useQueryClient()

  return () => {
    const keyArray = Array.isArray(keys[0]) ? (keys as QueryKey[]) : [keys as QueryKey]
    keyArray.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key })
    })
  }
}
