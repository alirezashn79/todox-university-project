'use client'

import { useDeleteDayPlan } from '@/hooks/queries/dayPlans/useDeleteDayPlan'
import { IUpdateDayPlanInput, useUpdateDayPlan } from '@/hooks/queries/dayPlans/useUpdateDayPlan'
import { cn } from '@/utils/cn'
import { compact } from '@/utils/compact'
import { fireConfirmSwal } from '@/utils/swal'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface IProps {
  id: string
  important?: string | null
  isDoneImportant?: boolean | null
}

type IUpdateDayPlanForm = Omit<IUpdateDayPlanInput, 'id'>

export default function ImportantItem({ id, important, isDoneImportant }: IProps) {
  const [isShow, setIsShow] = useState(false)
  const [isChecked, setIsChecked] = useState(Boolean(isDoneImportant))
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
      setIsChecked(false)
      return
    }
    handleSubmit(handleUpdateDayPlan)()
  }

  useEffect(() => {
    if (isChecked) {
      setIsShow(false)
      setIsEdit(false)
    }
  }, [isChecked, setIsShow])

  useEffect(() => {
    setIsChecked(Boolean(isDoneImportant))
  }, [isDoneImportant])

  const handleChangeIsDone = async (e: ChangeEvent<HTMLInputElement>) => {
    await UpdateDayPlan(
      {
        id,
        isDoneImportant: e.target.checked,
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
      successFunctionVoid: () => deleteDayPlan({ id }),
      successText: 'حذف شد',
    })
  }

  return (
    <li
      className={cn(
        'flex cursor-pointer items-start gap-2 rounded-lg bg-base-100 p-2 transition-all hover:border hover:border-slate-400 hover:bg-base-200',
        isShow && 'border border-slate-400 bg-base-200',
        isChecked && 'border border-error !bg-error/5',
        isPendingDeleteDayPlan && 'animate-pulse border border-error bg-error/20'
      )}
    >
      {isPendingUpdateDayPlan || isPendingDeleteDayPlan ? (
        <div
          className={cn(
            'checkbox-xs size-4 animate-spin rounded-full border-t-[9px] border-t-error',
            isPendingDeleteDayPlan && '!checkbox-error'
          )}
        />
      ) : (
        <label className="w-fit translate-y-0.5">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChangeIsDone}
            className="checkbox-error checkbox checkbox-xs"
          />
        </label>
      )}
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
                name="important"
                defaultValue={important}
                rules={{
                  required: false,
                  minLength: 1,
                }}
                render={({ field: { value, ...rest }, fieldState }) => (
                  <>
                    <label className="label">عنوان</label>
                    <input
                      {...rest}
                      value={value ?? ''}
                      autoFocus
                      className="input input-sm input-error w-full leading-5"
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
                  isChecked && 'text-error line-through'
                )}
              >
                {important}
              </p>
            )}
          </div>
        </form>

        {isShow && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className={cn('btn btn-error btn-xs', isEdit && '!btn-error')}
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
