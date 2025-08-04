'use client'
import { ITodo } from '@/types'
import { percentage } from '@/utils/clientHelpers'
import { cn } from '@/utils/cn'

export default function TodoStateStyle({ data }: { data: ITodo[] }) {
  let percent = 0
  let checkedCount = 0
  let totalCount = 0
  if (!!data?.length) {
    totalCount = data?.length
    checkedCount = data?.filter((item) => item.isDone).length
    percent = percentage(totalCount, checkedCount)
  }

  const percentCountStyle = (): string => {
    let style = ''
    if (percent < 10) {
      style = 'text-rose-900'
    } else if (percent >= 10 && percent < 25) {
      style = 'text-error'
    } else if (percent >= 20 && percent < 50) {
      style = 'text-warning'
    } else if (percent >= 50 && percent < 79) {
      style = 'text-info'
    } else {
      style = 'text-success'
    }
    return style
  }

  const percentEmojiStyle = (): string => {
    let emoji = ''
    if (percent === 0) {
      emoji = '😡'
    } else if (percent < 10) {
      emoji = '😠'
    } else if (percent >= 10 && percent < 20) {
      emoji = '🙄'
    } else if (percent >= 20 && percent < 35) {
      emoji = '🙂'
    } else if (percent >= 35 && percent < 50) {
      emoji = '😏'
    } else if (percent >= 50 && percent < 75) {
      emoji = '😊'
    } else if (percent >= 75 && percent < 85) {
      emoji = '😇'
    } else if (percent >= 85 && percent < 95) {
      emoji = '🥳'
    } else if (percent >= 95 && percent < 100) {
      emoji = '🤩'
    } else if (percent === 100) {
      emoji = '😎'
      // setIsExploding(true);
    }
    return emoji
  }

  return (
    <div className="mb-2.5 flex items-center justify-evenly">
      <div className={cn('flex items-center gap-2', percentCountStyle())}>
        <span>وضعیت: </span>
        <p className={'text-lg'}>
          <span>{checkedCount}</span>
          {' از '}
          <span>{totalCount}</span>
        </p>
      </div>

      <div className={cn(percentCountStyle(), 'text-lg')}>
        <span className="text-base">درصد موفقیت: </span>
        <span>%</span>
        <span> {percent}</span>
        <span className="animate_emoji mx-1 inline-block text-2xl">{percentEmojiStyle()}</span>
      </div>
    </div>
  )
}
