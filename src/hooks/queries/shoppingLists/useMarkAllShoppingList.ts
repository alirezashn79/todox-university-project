import { useRefresh } from '@/hooks/useRefresh'
import useDateStore from '@/stores/DateStore'
import client from '@/utils/client'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import endpoints from '@/utils/endpoints'
import { FireToast } from '@/utils/toast'
import { useMutation } from '@tanstack/react-query'

export interface IMarkAllShoppingItemsInput {
  isPurchased: boolean
}

export function useMarkAllShoppingItems() {
  const date = useDateStore((state) => state.date)
  const refresh = useRefresh(['user-shopping-list'])

  return useMutation<void, Error, IMarkAllShoppingItemsInput>({
    mutationKey: ['mark-all-shopping-items', date],
    mutationFn: async ({ isPurchased }) => {
      await client.patch(endpoints.markAllShoppingList, {
        date: convertPersianDateToEnglishNumbers(date),
        isPurchased,
      })
    },
    onSuccess: () => {
      refresh()
      FireToast({ type: 'success', message: 'وضعیت همهٔ آیتم‌ها به‌روز شد' })
    },
  })
}
