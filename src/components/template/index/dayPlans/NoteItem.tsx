'use client'

import { useDeleteDayPlan } from '@/hooks/queries/dayPlans/useDeleteDayPlan'
import { IUpdateDayPlanInput, useUpdateDayPlan } from '@/hooks/queries/dayPlans/useUpdateDayPlan'
import { cn } from '@/utils/cn'
import { compact } from '@/utils/compact'
import { fireConfirmSwal } from '@/utils/swal'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface IProps {
  id: string
  note?: string | null
}

type IUpdateDayPlanForm = Omit<IUpdateDayPlanInput, 'id'>

export default function NoteItem({ id, note }: IProps) {
  const [isShow, setIsShow] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const { control, handleSubmit } = useForm<IUpdateDayPlanForm>()

  const handleUpdateDayPlan: SubmitHandler<IUpdateDayPlanForm> = async (values) => {
    await UpdateDayPlan(
      {
        id,
        ...compact(values),
      },
      {
        onSuccess: () => {
          setIsEdit(false)
        },
      }
    )
  }

  const { mutateAsync: UpdateDayPlan, isPending: isPendingUpdateDayPlan } = useUpdateDayPlan()
  const { mutateAsync: deleteDayPlan, isPending: isPendingDeleteDayPlan } = useDeleteDayPlan()

  const handleEdit = async () => {
    if (!isEdit) {
      setIsEdit(true)
      return
    }
    handleSubmit(handleUpdateDayPlan)()
  }

  const handleDelete = () => {
    fireConfirmSwal({
      confirmText: 'آیا حذف شود؟',
      subText: 'این عمل برگشت پذیر نیست!',
      successFunctionVoid: () => deleteDayPlan({ id }),
      successText: 'حذف شد',
    })
  }

  return (
    <li
      className={cn(
        'flex cursor-pointer items-start gap-2 rounded-lg bg-base-100 p-2 transition-all hover:border hover:border-slate-400 hover:bg-base-200',
        isShow && 'border border-slate-400 bg-base-200',
        isPendingDeleteDayPlan && 'animate-pulse border border-accent bg-accent/20'
      )}
    >
      <div
        onClick={() => {
          if (!isShow) setIsShow(true)
        }}
        className="grow transition-all"
      >
        <form
          onSubmit={handleSubmit(handleUpdateDayPlan)}
          className="flex flex-col items-start gap-2"
        >
          <div className="w-full">
            {isEdit ? (
              <Controller
                control={control}
                name="notes"
                defaultValue={note}
                rules={{
                  required: false,
                  minLength: 1,
                }}
                render={({ field: { value, ...rest }, fieldState }) => (
                  <>
                    <textarea
                      {...rest}
                      value={value ?? ''}
                      autoFocus
                      className="textarea textarea-accent textarea-sm w-full leading-5"
                    />
                    {fieldState.error?.message && (
                      <span className="mt-2 text-xs text-accent">{fieldState.error?.message}</span>
                    )}
                  </>
                )}
              />
            ) : (
              <p className={cn('line-clamp-2 grow select-none', isShow && 'line-clamp-none')}>
                {note}
              </p>
            )}
          </div>
        </form>

        {isShow && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className={cn('btn btn-accent btn-xs', isEdit && '!btn-accent')}
              onClick={handleEdit}
            >
              {isEdit ? 'ثبت' : 'ویرایش'}
            </button>
            <button onClick={handleDelete} type="button" className="btn btn-accent btn-xs">
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
