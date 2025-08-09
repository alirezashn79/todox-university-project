'use client'
import { useGetUserDayPlans } from '@/hooks/queries/dayPlans/useGetUserDayPlans'
import dynamic from 'next/dynamic'
import ImportantSection from './ImportantSection'
import NoteSection from './NoteSection'
import MoodSection from './MoodSection'
const ShoppingListSection = dynamic(() => import('../shoppingList/ShoppingListsSection'))

export default function DayPlanSection() {
  const {
    data: dayPlans,
    isPending: isPendingDayPlans,
    isRefetching: isRefetchingDayPlans,
  } = useGetUserDayPlans()

  return (
    <>
      <div className="flex h-full flex-col gap-2">
        <ShoppingListSection />
        <ImportantSection
          dayPlans={dayPlans}
          isPending={isPendingDayPlans}
          isRefetching={isRefetchingDayPlans}
        />
      </div>

      <div className="flex h-full flex-col gap-2">
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
      </div>
    </>
  )
}
