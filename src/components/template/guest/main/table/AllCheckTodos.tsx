'use client'
import useDateStore from '@/stores/DateStore'
import useGuest from '@/stores/GuestStore'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import { FireToast } from '@/utils/toast'
import { useState } from 'react'
import { HashLoader } from 'react-spinners'

interface IAllCheckProps {
  checkAll: boolean
}

export default function AllCheckTodos({ checkAll }: IAllCheckProps) {
  const date = useDateStore((state) => state.date)
  const [loading, setLoading] = useState(false)
  const setCheckAll = useGuest((state) => state.checkAll)

  const handleAllCheck = async () => {
    try {
      setLoading(true)
      setCheckAll({
        date: convertPersianDateToEnglishNumbers(date),
        isCheck: !checkAll,
      })
      FireToast({
        type: 'success',
        message: `همه کارها در حالت  ${!checkAll ? 'انجام شده' : 'انجام نشده'} قرار گرفتند`,
      })
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
        // <span className="loading loading-spinner text-primary loading-md"></span>
        <div className="my-[2.5px] lg:my-[3.5px]">
          <HashLoader size={24} color="#00a96e" />
        </div>
      ) : (
        <label>
          <input
            checked={checkAll}
            onChange={handleAllCheck}
            type="checkbox"
            className="checkbox-success checkbox"
          />
        </label>
      )}
    </>
  )
}
