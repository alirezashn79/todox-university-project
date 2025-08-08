'use client'

import { cn } from '@/utils/cn'

import { useDeleteAppointment } from '@/hooks/queries/appointments/useDeleteAppointment'
import {
  IUpdateAppointmentInput,
  useUpdateAppointment,
} from '@/hooks/queries/appointments/useUpdateAppointment'
import { convertToPersianTimeWithEnglishNumbers } from '@/utils/clientHelpers'
import { fireConfirmSwal } from '@/utils/swal'
import { X } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
import Flatpickr from 'react-flatpickr'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface IProps {
  id: string
  title: string
  time: string
  description?: string
  isDone: boolean
}

type IUpdateAppointmentForm = Omit<IUpdateAppointmentInput, 'id'>

export default function AppointmentItem({ id, title, description, isDone, time }: IProps) {
  const [isShow, setIsShow] = useState(false)
  const [isChecked, setIsChecked] = useState(isDone)
  const [isEdit, setIsEdit] = useState(false)
  const { control, handleSubmit, resetField, reset } = useForm<IUpdateAppointmentForm>()

  const handleUpdateTodo: SubmitHandler<IUpdateAppointmentForm> = async (values) => {
    await updateAppointment(
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

  const { mutateAsync: updateAppointment, isPending: isPendingUpdate } = useUpdateAppointment()
  const { mutateAsync: deleteTodo, isPending: isPendingDelete } = useDeleteAppointment()

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
    await updateAppointment(
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
        isChecked && 'border border-primary !bg-primary/5',
        isPendingDelete && 'animate-pulse border border-error bg-error/20'
      )}
    >
      {isPendingUpdate || isPendingDelete ? (
        <div
          className={cn(
            'checkbox-xs size-4 animate-spin rounded-full border-t-[9px] border-t-primary',
            isPendingDelete && '!checkbox-error'
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
        <form className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            {isEdit ? (
              <Controller
                control={control}
                name="title"
                defaultValue={title}
                rules={{
                  required: true,
                  minLength: 1,
                }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      {...field}
                      autoFocus
                      className="input input-sm input-primary w-full px-2 text-start leading-5"
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
                  isChecked && 'text-primary line-through'
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
                  required: true,
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
                      className={cn('input input-sm input-primary w-20 text-center')}
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
          </div>

          {isEdit ? (
            <Controller
              control={control}
              name="description"
              defaultValue={description ?? ''}
              rules={{
                required: false,
                minLength: 1,
              }}
              render={({ field: { value, ...rest }, fieldState }) => (
                <>
                  <textarea
                    {...rest}
                    value={value ?? ''}
                    className="textarea textarea-warning textarea-sm min-h-20 w-full px-2 text-start leading-5"
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
                'line-clamp-2 grow select-none text-xs text-primary',
                isShow && 'line-clamp-none',
                isChecked && 'text-primary line-through'
              )}
            >
              {description}
            </p>
          )}
        </form>

        {isShow && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className={cn('btn btn-info btn-xs', isEdit && '!btn-primary')}
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
