'use client'

import { useCreateDayPlan } from '@/hooks/queries/dayPlans/useCreateDayPlan'
import { MoodType } from '@/types/dayPlans'
const moodConfig = [
  { icon: '🤩', name: 'AWESOME' },
  { icon: '🙂', name: 'GOOD' },
  { icon: '😐', name: 'FAIR' },
  { icon: '☹️', name: 'BAD' },
  { icon: '😭', name: 'TERRIBLE' },
]

export default function MoodReactions() {
  const { mutateAsync } = useCreateDayPlan()
  const onClick = async (value: MoodType) => {
    await mutateAsync({
      mood: value,
    })
  }
  return (
    <div className="mx-auto flex items-center gap-1">
      {moodConfig.map((item) => (
        <button
          onClick={() => onClick(item.name as MoodType)}
          className="group btn btn-ghost p-1 hover:bg-purple-900/10"
        >
          <span className="text-2xl">{item.icon}</span>
        </button>
      ))}
    </div>
  )
}
