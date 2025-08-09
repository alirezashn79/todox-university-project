'use client'
import { ICreateGoalInput, useCreateGoal } from '@/hooks/queries/goals/useCreateGoal'
import { useGetUserGoals } from '@/hooks/queries/goals/useGetUserGoals'
import useMarkAllGoals from '@/hooks/queries/goals/useMarkAll'
import { ChangeEvent, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import GoalItem from './GoalItem'
import Card from '@/components/modules/Card'
import { cn } from '@/utils/cn'

export default function GoalSection() {
  const { data: goals, isPending, isRefetching } = useGetUserGoals()
  const { control, handleSubmit, reset } = useForm<ICreateGoalInput>()
  const { mutateAsync: createGoal, isPending: isPenginsCreateTodo } = useCreateGoal()
  const { mutateAsync: markAll, isPending: isPendingMarkAll } = useMarkAllGoals()
  const [isAdd, setIsAdd] = useState(false)

  const openAdd = () => setIsAdd(true)
  const closeAdd = () => setIsAdd(false)

  const onSubmit: SubmitHandler<ICreateGoalInput> = async (values) => {
    await createGoal(values, {
      onSuccess: () => {
        reset()
        closeAdd()
      },
    })
  }

  const handleMarkAll = async (event: ChangeEvent<HTMLInputElement>) => {
    await markAll({
      isAchieved: event.target.checked,
    })
  }

  const isEmpty = !goals || goals?.length === 0
  let total = goals?.length
  let donedCount = goals?.filter((item) => item.isAchieved).length

  return (
    <Card
      theme="warning"
      title="اهداف امروز"
      isShowAddButton={!isEmpty}
      onAddClick={openAdd}
      isLoading={isRefetching || isPendingMarkAll}
    >
      {isPending && (
        <div className="animate-pulse space-y-2">
          <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
        </div>
      )}

      {isEmpty && !isAdd && !isPending && (
        <div className="flex min-h-full flex-col items-center justify-center gap-2 md:min-h-40">
          <h4>هدفی اضافه نکردی</h4>
          <button onClick={openAdd} className="btn btn-warning btn-xs">
            افزودن
          </button>
        </div>
      )}

      {isAdd && (
        <div className="bg-base-100 p-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">عنوان کار</label>
              <Controller
                control={control}
                name="title"
                defaultValue=""
                rules={{
                  required: { value: true, message: 'عنوان الزامی است' },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <textarea
                      {...field}
                      autoFocus
                      className="textarea textarea-warning textarea-sm w-full"
                      placeholder="عنوان کار را وارد کنید"
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
                disabled={isPenginsCreateTodo}
                type="submit"
                className="btn btn-warning btn-xs"
              >
                {!isPenginsCreateTodo ? (
                  'ثبت'
                ) : (
                  <div className="size-3 animate-spin rounded-full border-t-2" />
                )}
              </button>
              <button
                disabled={isPenginsCreateTodo}
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
                checked={goals?.every((item) => item.isAchieved)}
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

      {!isAdd &&
        goals?.map((goal) => (
          <GoalItem
            key={goal._id.toString()}
            id={goal._id.toString()}
            title={goal.title}
            isAchieved={goal.isAchieved}
          />
        ))}
    </Card>
  )
}
