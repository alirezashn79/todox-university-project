'use client'
import { useGetUserDayPlans } from '@/hooks/queries/dayPlans/useGetUserDayPlans'
import dynamic from 'next/dynamic'
const ShoppingListSection = dynamic(() => import('../shoppingList/ShoppingListsSection'))
const ImportantSection = dynamic(() => import('./ImportantSection'))
const NoteSection = dynamic(() => import('./NoteSection'))
const MoodSection = dynamic(() => import('./MoodSection'))

export default function DayPlanSection() {
  const {
    data: dayPlans,
    isPending: isPendingDayPlans,
    isRefetching: isRefetchingDayPlans,
  } = useGetUserDayPlans()

  return (
    <>
      <ShoppingListSection />
      <ImportantSection
        dayPlans={dayPlans}
        isPending={isPendingDayPlans}
        isRefetching={isRefetchingDayPlans}
      />

      <NoteSection
        dayPlans={dayPlans}
        isPending={isPendingDayPlans}
        isRefetching={isRefetchingDayPlans}
      />
      <MoodSection
        dayPlans={dayPlans}
        isPending={isPendingDayPlans}
        isRefetching={isRefetchingDayPlans}
      />
    </>
  )
}
