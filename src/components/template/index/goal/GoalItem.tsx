'use client'

import { cn } from '@/utils/cn'

import { useDeleteGoal } from '@/hooks/queries/goals/useDeleteGoal'
import { IUpdateGoalInput, useUpdateGoal } from '@/hooks/queries/goals/useUpdateGoal'
import { fireConfirmSwal } from '@/utils/swal'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'

interface IProps {
  id: string
  title: string
  time?: string
  isAchieved: boolean
}

type IUpdateGoalForm = Omit<IUpdateGoalInput, 'id'>

export default function GoalItem({ id, title, isAchieved, time }: IProps) {
  const [isShow, setIsShow] = useState(false)
  const [isChecked, setIsChecked] = useState(isAchieved)
  const [isEdit, setIsEdit] = useState(false)
  const { control, handleSubmit, resetField, reset } = useForm<IUpdateGoalForm>()
  const { title: titleState } = useWatch({ control })

  const handleUpdateGoal: SubmitHandler<IUpdateGoalForm> = async (values) => {
    await UpdateGoal(
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

  const { mutateAsync: UpdateGoal, isPending: isPendingUpdateGoal } = useUpdateGoal()
  const { mutateAsync: deleteGoal, isPending: isPendingDeleteGoal } = useDeleteGoal()

  const handleEdit = async () => {
    if (!isEdit) {
      setIsEdit(true)
      setIsChecked(false)
      return
    }
    handleSubmit(handleUpdateGoal)()
  }

  useEffect(() => {
    if (isChecked) {
      setIsShow(false)
      setIsEdit(false)
    }
  }, [isChecked, setIsShow])

  useEffect(() => {
    setIsChecked(isAchieved)
  }, [isAchieved])

  const handleChangeIsDone = async (e: ChangeEvent<HTMLInputElement>) => {
    await UpdateGoal(
      {
        id,
        isAchieved: e.target.checked,
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
      successFunctionVoid: () => deleteGoal({ id }),
      successText: 'حذف شد',
    })
  }

  return (
    <li
      className={cn(
        'flex cursor-pointer items-start gap-2 rounded-lg bg-base-100 p-2 transition-all hover:border hover:border-slate-400 hover:bg-base-200',
        isShow && 'border border-slate-400 bg-base-200',
        isChecked && 'border border-warning !bg-warning/5',
        isPendingDeleteGoal && 'animate-pulse border border-error bg-error/20'
      )}
    >
      {isPendingUpdateGoal || isPendingDeleteGoal ? (
        <div
          className={cn(
            'checkbox-xs size-4 animate-spin rounded-full border-t-[9px] border-t-warning',
            isPendingDeleteGoal && '!checkbox-error'
          )}
        />
      ) : (
        <label className="w-fit translate-y-0.5">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChangeIsDone}
            className="checkbox-warning checkbox checkbox-xs"
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
                'line-clamp-2 grow select-none',
                isShow && 'line-clamp-none',
                isChecked && 'text-warning line-through'
              )}
            >
              {title}
            </p>
          )}
        </form>

        {isShow && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className={cn('btn btn-info btn-xs', isEdit && '!btn-warning')}
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
