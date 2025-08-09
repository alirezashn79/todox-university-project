'use client'

import { ICreateDayPlanInput, useCreateDayPlan } from '@/hooks/queries/dayPlans/useCreateDayPlan'
import { IDayPlan } from '@/types/dayPlans'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import NoteItem from './NoteItem'

interface IProps {
  dayPlans: IDayPlan[] | undefined
  isPending: boolean
  isRefetching: boolean
}

export default function NoteSection({ dayPlans, isPending }: IProps) {
  const { control, handleSubmit, reset } = useForm<ICreateDayPlanInput>()
  const { mutateAsync: createDayPlan, isPending: isPenginsCreateDayPlan } = useCreateDayPlan()
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

  const isEmpty = !dayPlans || !dayPlans?.[0]?.notes

  return (
    <div className="!hide-scrollbar card h-full min-h-80 overflow-hidden bg-base-300 md:h-40 xl:h-full xl:min-h-max">
      <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
        <h2 className="mb-4 pt-2 text-center text-lg text-accent">یادداشت</h2>
      </div>
      <div className="h-full space-y-2 overflow-y-auto text-pretty p-2 text-sm">
        {isPending && (
          <div className="animate-pulse space-y-2">
            <div className="h-40 w-full animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
          </div>
        )}

        {isEmpty && !isAdd && !isPending && (
          <div className="flex min-h-full flex-col items-center justify-center gap-2 md:min-h-40">
            <h4>یادداشتی اضافه نکردی</h4>
            <button onClick={openAdd} className="btn btn-accent btn-xs">
              افزودن
            </button>
          </div>
        )}

        {isAdd && (
          <div className="bg-base-100 p-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="label">متن</label>
                <Controller
                  control={control}
                  name="notes"
                  defaultValue=""
                  rules={{
                    required: { value: true, message: 'متن الزامی است' },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <textarea
                        {...field}
                        autoFocus
                        className="textarea textarea-accent textarea-sm w-full"
                        placeholder="متن یادداشت را وارد کنید"
                      />
                      {fieldState.error?.message && (
                        <span className="mt-2 text-xs text-accent">
                          {fieldState.error?.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  disabled={isPenginsCreateDayPlan}
                  type="submit"
                  className="btn btn-accent btn-xs"
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
                  className="btn btn-accent btn-xs"
                >
                  لغو
                </button>
              </div>
            </form>
          </div>
        )}

        {!isEmpty &&
          dayPlans?.map((dayPlan) => (
            <NoteItem
              key={dayPlan._id.toString()}
              id={dayPlan._id.toString()}
              note={dayPlan.notes}
            />
          ))}
      </div>
    </div>
  )
}
