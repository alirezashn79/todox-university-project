'use client'

import { cn } from '@/utils/cn'

import useDeleteTodo from '@/hooks/queries/todos/useDeleteTodo'
import useUpdateTodo, { IUpdateTodo } from '@/hooks/queries/todos/useUpdateTodo'
import { convertToPersianTimeWithEnglishNumbers } from '@/utils/clientHelpers'
import { fireConfirmSwal } from '@/utils/swal'
import { X } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
import Flatpickr from 'react-flatpickr'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'

interface IProps {
  id: string
  title: string
  time?: string
  isDone: boolean
}

type IUpdateTodoForm = Omit<IUpdateTodo, 'id'>

export default function TodoItem({ id, title, isDone, time }: IProps) {
  const [isShow, setIsShow] = useState(false)
  const [isChecked, setIsChecked] = useState(isDone)
  const [isEdit, setIsEdit] = useState(false)
  const { control, handleSubmit, resetField, reset } = useForm<IUpdateTodoForm>()
  const { title: titleState, time: timeState } = useWatch({ control })

  const handleUpdateTodo: SubmitHandler<IUpdateTodoForm> = async (values) => {
    await updateTodo(
      {
        id,
        ...values,
      },
      {
        onSuccess: () => {
          setIsEdit(false)
        },
      }
    )
  }

  const { mutateAsync: updateTodo, isPending: isPendingUpdateTodo } = useUpdateTodo()
  const { mutateAsync: deleteTodo, isPending: isPendingDeleteTodo } = useDeleteTodo()

  const handleEdit = async () => {
    if (!isEdit) {
      setIsEdit(true)
      setIsChecked(false)
      return
    }
    handleSubmit(handleUpdateTodo)()
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

  const handleDelete = () => {
    fireConfirmSwal({
      confirmText: 'آیا حذف شود؟',
      subText: 'این عمل برگشت پذیر نیست!',
      successFunctionVoid: () => deleteTodo({ id }),
      successText: 'حذف شد',
    })
  }

  return (
    <li
      className={cn(
        'flex cursor-pointer items-start gap-2 rounded-lg bg-base-100 p-2 transition-all hover:border hover:border-slate-400 hover:bg-base-200',
        isShow && 'border border-slate-400 bg-base-200',
        isChecked && 'border border-success !bg-success/5',
        isPendingDeleteTodo && 'animate-pulse border border-error bg-error/20'
      )}
    >
      {isPendingUpdateTodo || isPendingDeleteTodo ? (
        <div
          className={cn(
            'checkbox-xs size-4 animate-spin rounded-full border-t-[9px] border-t-success',
            isPendingDeleteTodo && '!checkbox-error'
          )}
        />
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
        <form className="flex items-start gap-2">
          {isEdit ? (
            <Controller
              control={control}
              name="title"
              defaultValue={title}
              rules={{
                required: false,
                minLength: 1,
              }}
              render={({ field, fieldState }) => (
                <>
                  <textarea
                    {...field}
                    autoFocus
                    className="textarea textarea-success textarea-sm min-h-20 w-full px-2 text-start leading-5"
                  />
                  {fieldState.error?.message && (
                    <span className="mt-2 text-xs text-error">{fieldState.error?.message}</span>
                  )}
                </>
              )}
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
            <Controller
              control={control}
              name="time"
              defaultValue={time}
              rules={{
                required: false,
                minLength: 4,
              }}
              render={({ field: { onChange, ref, ...rest }, fieldState }) => (
                <div className="relative">
                  <Flatpickr
                    {...rest}
                    onChange={([date]) => {
                      onChange(convertToPersianTimeWithEnglishNumbers(date))
                    }}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'H:i',
                      time_24hr: true,
                      enableSeconds: false,
                    }}
                    placeholder="زمان"
                    className={cn('input input-sm input-success w-20 text-center')}
                  />
                  {rest.value && (
                    <button
                      onClick={() =>
                        resetField('time', {
                          defaultValue: '',
                        })
                      }
                      type="button"
                      className="absolute start-2 top-0 translate-y-1/2"
                    >
                      <X className="size-3.5 text-error" />
                    </button>
                  )}
                  {fieldState.error?.message && (
                    <span className="mt-1 text-xs text-error">{fieldState.error?.message}</span>
                  )}
                </div>
              )}
            />
          ) : (
            <code className="badge badge-info badge-sm translate-y-1 font-semibold">
              {time || '--:--'}
            </code>
          )}
        </form>

        {isShow && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className={cn('btn btn-info btn-xs', isEdit && '!btn-success')}
              onClick={handleEdit}
            >
              {isEdit ? 'ثبت' : 'ویرایش'}
            </button>
            <button onClick={handleDelete} type="button" className="btn btn-error btn-xs">
              حذف
            </button>
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
