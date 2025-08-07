'use client'

import { cn } from '@/utils/cn'

import { convertToPersianTimeWithEnglishNumbers, timeStringToDate } from '@/utils/clientHelpers'
import { ChangeEvent, useEffect, useState } from 'react'
import Flatpickr from 'react-flatpickr'
import useUpdateTodo from '@/hooks/queries/todos/useUpdateTodo'

interface IProps {
  id: string
  title: string
  time?: string
  isDone: boolean
}

export default function TodoItem({ id, title, isDone, time }: IProps) {
  const [isShow, setIsShow] = useState(false)
  const [isChecked, setIsChecked] = useState(isDone)
  const [isEdit, setIsEdit] = useState(false)
  const [editTime, setEditTime] = useState(time ?? '')
  const [editText, setEditText] = useState(title ?? '')

  const { mutateAsync: updateTodo, isPending: isPendingUpdateTodo } = useUpdateTodo()

  const toggleCheck = () => setIsChecked((prev) => !prev)

  const handleEdit = async () => {
    if (!isEdit) {
      setIsEdit(true)
      setIsChecked(false)
      return
    }
    alert('ds')
  }

  useEffect(() => {
    if (isChecked) {
      setIsShow(false)
      setIsEdit(false)
    }
  }, [isChecked, setIsShow])

  useEffect(() => {
    setIsChecked(isDone)
  }, [isDone])

  const handleChangeIsDone = async (e: ChangeEvent<HTMLInputElement>) => {
    await updateTodo(
      {
        id,
        isDone: e.target.checked,
      },
      {
        onSuccess: () => {
          setIsChecked(e.target.checked)
        },
      }
    )
  }

  return (
    <li
      className={cn(
        'flex cursor-pointer items-start gap-2 rounded-lg bg-base-100 p-2 transition-all hover:border hover:border-slate-400 hover:bg-base-200',
        isShow && 'border border-slate-400 bg-base-200',
        isChecked && 'border border-success !bg-success/5'
      )}
    >
      {isPendingUpdateTodo ? (
        <div className="checkbox-xs size-4 animate-spin rounded-full border-t-[9px] border-t-success" />
      ) : (
        <label className="w-fit translate-y-0.5">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChangeIsDone}
            className="checkbox-accent checkbox checkbox-xs"
          />
        </label>
      )}
      <div
        onClick={() => {
          if (!isShow) setIsShow(true)
        }}
        className="grow transition-all"
      >
        <div className="flex items-start gap-2">
          {isEdit ? (
            <textarea
              autoFocus
              className="textarea textarea-success textarea-sm min-h-20 w-full px-2 text-start leading-5"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <p
              className={cn(
                'line-clamp-2 grow select-none',
                isShow && 'line-clamp-none',
                isChecked && 'text-success line-through'
              )}
            >
              {title}
            </p>
          )}

          {isEdit ? (
            <Flatpickr
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
                time_24hr: true,
              }}
              value={editTime ? timeStringToDate(editTime) : new Date()}
              onChange={([date]) => {
                setEditTime(convertToPersianTimeWithEnglishNumbers(date))
              }}
              className="input input-sm input-bordered w-16 text-center"
            />
          ) : (
            <code className="badge badge-info badge-sm translate-y-1 font-semibold">
              {editTime || '--:--'}
            </code>
          )}
        </div>

        {isShow && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className={cn('btn btn-info btn-xs', isEdit && '!btn-success')}
              onClick={handleEdit}
            >
              {isEdit ? 'ثبت' : 'ویرایش'}
            </button>
            <button className="btn btn-error btn-xs">حذف</button>
            <button
              className="btn btn-outline btn-xs"
              onClick={() => {
                setIsShow(false)
                setIsEdit(false)
              }}
            >
              بستن
            </button>
          </div>
        )}
      </div>
    </li>
  )
}
