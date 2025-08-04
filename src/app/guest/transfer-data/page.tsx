'use client'
import useGuest from '@/stores/GuestStore'
import client from '@/utils/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function page() {
  const todos = useGuest((state) => state.todos)
  const { replace } = useRouter()

  useEffect(() => {
    const transferDate = async () => {
      if (!!todos && todos.length > 0) {
        const body = todos.map((item) => ({
          date: item.date,
          isDone: item.isDone,
          time: item.time,
          title: item.title,
        }))

        try {
          await client.post('api/todo/guest', body)

          localStorage.removeItem('guest')

          setTimeout(() => {
            replace('/')
          }, 2000)
        } catch (error) {
          console.log(error)
        }
      }
    }
    transferDate()
  }, [])
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <p className="block"> داده های شما در حال ثبت در پایگاه داده هستند</p>
        <progress className="progress w-56"></progress>
      </div>
    </div>
  )
}
