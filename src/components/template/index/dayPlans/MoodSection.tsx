'use client'

import Card from '@/components/modules/Card'
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

export default function MoodSection({ dayPlans, isRefetching }: IProps) {
  const { mutateAsync, isPending } = useCreateDayPlan()
  const [moodState, setMoodState] = useState<MoodType | null>(null)
  const [clickedMood, setClickedMood] = useState<MoodType | null>(null)

  const onClick = async (value: MoodType) => {
    setClickedMood(value)
    await mutateAsync(
      {
        mood: value,
      },
      {
        onSuccess: () => {
          setMoodState(value)
        },
        onSettled: () => {
          setClickedMood(null)
        },
      }
    )
  }

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
    <Card theme="secondary" title="حال روز" isLoading={isPending}>
      <div className="flex size-full items-center justify-center">
        {moodConfig.map((item) => (
          <button
            onClick={() => onClick(item.name as MoodType)}
            className={cn(
              'group btn btn-circle btn-ghost hover:bg-purple-900/20',
              moodState === item.name && 'btn-lg bg-secondary/20'
            )}
          >
            <span className={cn('text-2xl', moodState === item.name && 'animate_emoji text-3xl')}>
              {isPending && clickedMood === item.name ? (
                <div className="size-6 animate-spin rounded-full border-t-[10px] border-t-secondary" />
              ) : (
                item.icon
              )}
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}
