'use client'

import { ICreateDayPlanInput, useCreateDayPlan } from '@/hooks/queries/dayPlans/useCreateDayPlan'
import useMarkAllDayPlans from '@/hooks/queries/dayPlans/useMarkAll'
import { IDayPlan } from '@/types/dayPlans'
import { ChangeEvent, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import ImportantItem from './ImportantItem'

interface IProps {
  dayPlans: IDayPlan[] | undefined
  isPending: boolean
  isRefetching: boolean
}

export default function ImportantSection({ dayPlans, isPending, isRefetching }: IProps) {
  const { control, handleSubmit, reset } = useForm<ICreateDayPlanInput>()
  const { mutateAsync: createDayPlan, isPending: isPenginsCreateDayPlan } = useCreateDayPlan()
  const { mutateAsync: markAll, isPending: isPendingMarkAll } = useMarkAllDayPlans()
  const [isAdd, setIsAdd] = useState(false)

  const openAdd = () => setIsAdd(true)
  const closeAdd = () => setIsAdd(false)

  const onSubmit: SubmitHandler<ICreateDayPlanInput> = async (values) => {
    await createDayPlan(values, {
      onSuccess: () => {
        reset()
        closeAdd()
      },
    })
  }

  const handleMarkAll = async (event: ChangeEvent<HTMLInputElement>) => {
    await markAll({
      isDoneImportant: event.target.checked,
    })
  }

  const isEmpty = !dayPlans || dayPlans?.length === 0
  let total = dayPlans?.length
  let donedCount = dayPlans?.filter((item) => item.isDoneImportant).length

  return (
    <div className="!hide-scrollbar card h-full min-h-80 overflow-hidden bg-base-300 md:h-40 xl:h-full xl:min-h-max">
      <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
        <h2 className="mb-4 pt-2 text-center text-lg text-error">مهم روز</h2>
        {!isEmpty && (
          <div className="absolute end-4 top-3">
            <button onClick={openAdd} className="btn btn-error btn-xs">
              افزودن
            </button>
          </div>
        )}
      </div>
      <div className="h-full space-y-2 overflow-y-auto text-pretty p-2 text-sm">
        {isPending && (
          <div className="animate-pulse space-y-2">
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
          </div>
        )}

        {isEmpty && !isAdd && !isPending && (
          <div className="flex min-h-full flex-col items-center justify-center gap-2 md:min-h-40">
            <h4>هدفی اضافه نکردی</h4>
            <button onClick={openAdd} className="btn btn-error btn-xs">
              افزودن
            </button>
          </div>
        )}

        {isAdd && (
          <div className="bg-base-100 p-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="label">عنوان</label>
                <Controller
                  control={control}
                  name="important"
                  defaultValue=""
                  rules={{
                    required: { value: true, message: 'عنوان الزامی است' },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        {...field}
                        autoFocus
                        className="input input-sm input-error w-full"
                        placeholder="عنوان را وارد کنید"
                      />
                      {fieldState.error?.message && (
                        <span className="mt-2 text-xs text-error">{fieldState.error?.message}</span>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  disabled={isPenginsCreateDayPlan}
                  type="submit"
                  className="btn btn-error btn-xs"
                >
                  {!isPenginsCreateDayPlan ? (
                    'ثبت'
                  ) : (
                    <div className="size-3 animate-spin rounded-full border-t-2" />
                  )}
                </button>
                <button
                  disabled={isPenginsCreateDayPlan}
                  onClick={closeAdd}
                  type="button"
                  className="btn btn-error btn-xs"
                >
                  لغو
                </button>
              </div>
            </form>
          </div>
        )}

        {!isAdd && !isEmpty && !isPending && (
          <div className="flex items-center gap-2 px-2">
            {isPendingMarkAll ? (
              <div className="checkbox-xs size-4 animate-spin rounded-full border-t-[9px] border-t-secondary" />
            ) : (
              <label className="w-fit translate-y-0.5">
                <input
                  type="checkbox"
                  checked={dayPlans?.every((item) => item.isDoneImportant)}
                  onChange={(e) => handleMarkAll(e)}
                  className="checkbox-secondary checkbox checkbox-xs"
                />
              </label>
            )}
            <div className="flex items-center gap-2">
              <p className="font-morabba">وضعیت</p>
              {isRefetching ? (
                <div className="h-4 w-10 animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
              ) : (
                <p className="space-x-1">
                  <span>{donedCount}</span>
                  <span>/</span>
                  <span>{total}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {dayPlans?.map((dayPlan) => (
          <ImportantItem
            key={dayPlan._id.toString()}
            id={dayPlan._id.toString()}
            important={dayPlan.important}
            isDoneImportant={dayPlan.isDoneImportant}
          />
        ))}
      </div>
    </div>
  )
}
