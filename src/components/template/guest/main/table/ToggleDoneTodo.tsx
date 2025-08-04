'use client'
import useGuest from '@/stores/GuestStore'
import { FireToast } from '@/utils/toast'
import { useState } from 'react'
import { HashLoader } from 'react-spinners'

export default function ToggleDoneTodo({ id, isDone }: { id: string; isDone: boolean }) {
  const [loading, setLoading] = useState(false)
  const toggleDoneTodo = useGuest((state) => state.toggleDoneTodo)

  const handleToggleDoneTodo = async (id: string) => {
    try {
      setLoading(true)
      toggleDoneTodo(id)
      FireToast({ type: 'success', message: 'اعمال شد' })
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }
  }

  return (
    <>
      {loading ? (
        <div className="my-1 lg:my-[5px]">
          <HashLoader size={24} color="#7480ff" />
        </div>
      ) : (
        <label>
          <input
            type="checkbox"
            className="checkbox-primary checkbox"
            checked={isDone}
            onChange={() => handleToggleDoneTodo(id)}
          />
        </label>
      )}
    </>
  )
}
