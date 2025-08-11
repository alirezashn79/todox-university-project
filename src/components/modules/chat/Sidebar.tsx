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
          'fixed bottom-0 right-0 top-0 z-20 w-64 shrink-0 bg-base-200 p-2 pt-20 lg:static lg:overflow-hidden',
          'transition-transform duration-200 ease-in-out',
          'lg:static lg:w-52 lg:translate-x-0 lg:pt-2 xl:w-60',
          isOpen ? 'translate-x-0' : 'translate-x-full'
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

        <div className="hide-scrollbar mt-4 h-full space-y-2 overflow-y-auto">
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
          className="absolute -end-10 top-20 flex h-8 w-10 items-center justify-center rounded-l-lg border border-r-0 border-base-content bg-base-100 text-base-content shadow-xl lg:hidden"
        >
          <ChevronLeft className={isOpen ? 'rotate-180' : ''} />
        </button>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-10 bg-base-300/50 lg:hidden"
        />
      )}
    </>
  )
}
