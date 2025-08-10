'use client'

import { useGetUserSessions } from '@/hooks/queries/chat/useGetUserSessions'
import { cn } from '@/utils/cn'
import { ChevronLeft, MoreVertical } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: sessions, isPending } = useGetUserSessions()
  const router = useRouter()
  const { id } = useParams()
  const isEmpty = sessions?.length === 0

  const handleNavigate = (id: string) => {
    router.push(`/ai-assistant/${id}`)
  }
  return (
    <>
      <aside
        className={cn(
          'fixed bottom-0 end-0 top-0 z-[99999] h-full w-72 -translate-x-72 bg-base-200 p-2 shadow transition-transform duration-300 lg:static lg:z-auto lg:basis-1/4 lg:translate-x-0 xl:basis-1/6',
          isOpen && 'translate-x-0'
        )}
      >
        <div className="flex w-full items-center justify-between">
          <h4 className="text-sm">تاریخچه</h4>
          <button onClick={() => router.push('/ai-assistant')} className="btn btn-primary btn-xs">
            چت جدید
          </button>
        </div>

        {isEmpty && (
          <div className="flex size-full items-center justify-center">
            <p>تاریخچه ای وجود ندارد</p>
          </div>
        )}
        {isPending && (
          <div className="flex size-full items-center justify-center">
            <div className="size-6 animate-spin rounded-full border-t-4 border-t-primary" />
          </div>
        )}

        <div className="mt-4 h-full space-y-2 overflow-y-auto">
          {sessions?.map((item) => (
            <div key={item.id} className="group relative">
              <div
                onClick={() => handleNavigate(item.id)}
                className={cn('btn btn-ghost btn-block', id === item.id && 'btn-active')}
              >
                {item.title}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute start-0 top-28 flex h-8 w-12 translate-x-12 items-center justify-center rounded-r-lg bg-gray-700 lg:hidden"
        >
          <ChevronLeft className={isOpen ? 'rotate-180' : ''} />
        </button>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[999] bg-base-300/50 lg:hidden"
        />
      )}
    </>
  )
}
