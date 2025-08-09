'use client'

import { useCreateDayPlan } from '@/hooks/queries/dayPlans/useCreateDayPlan'
import { IDayPlan, MoodType } from '@/types/dayPlans'
import { cn } from '@/utils/cn'
import { useEffect, useState } from 'react'
const moodConfig = [
  { icon: '🤩', name: 'AWESOME' },
  { icon: '🙂', name: 'GOOD' },
  { icon: '😐', name: 'FAIR' },
  { icon: '☹️', name: 'BAD' },
  { icon: '😭', name: 'TERRIBLE' },
]

interface IProps {
  dayPlans: IDayPlan[] | undefined
  isPending: boolean
  isRefetching: boolean
}

export default function MoodSection({ dayPlans }: IProps) {
  const { mutateAsync } = useCreateDayPlan()
  const onClick = async (value: MoodType) => {
    await mutateAsync(
      {
        mood: value,
      },
      {
        onSuccess: () => {
          setMoodState(value)
        },
      }
    )
  }
  const isMoodExist = dayPlans && dayPlans?.[0]?.mood
  const [moodState, setMoodState] = useState<MoodType | null>(null)
  useEffect(() => {
    if (dayPlans) {
      if (dayPlans[0]?.mood) {
        setMoodState(dayPlans[0].mood)
      } else {
        setMoodState(null)
      }
    }
  }, [dayPlans])

  return (
    <div className="!hide-scrollbar card overflow-y-auto bg-base-300 md:basis-1/4">
      <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
        <h2 className="mb-4 pt-2 text-center text-lg text-secondary">حال روز</h2>
      </div>
      <div className="mx-auto flex items-center gap-1">
        {moodConfig.map((item) => (
          <button
            onClick={() => onClick(item.name as MoodType)}
            className={cn(
              'group btn btn-circle btn-ghost hover:bg-purple-900/10',
              moodState === item.name && 'bg-warning/20'
            )}
          >
            <span className={cn('text-2xl', moodState === item.name && 'animate_emoji')}>
              {item.icon}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
