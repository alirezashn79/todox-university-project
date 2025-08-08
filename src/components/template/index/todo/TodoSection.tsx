'use client'
import useGetUserTodos from '@/hooks/queries/todos/useGetUserTodos'
import TodoItem from './todoItem'
import { ChangeEvent, useState } from 'react'
import Flatpickr from 'react-flatpickr'
import useCreateTodo, { ICreateTodo } from '@/hooks/queries/todos/useCreateTodo'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { convertToPersianTimeWithEnglishNumbers } from '@/utils/clientHelpers'
import { cn } from '@/utils/cn'
import useMarkAll from '@/hooks/queries/todos/useMarkAll'

export default function TodoSection() {
  const { data: todos, isPending, isRefetching } = useGetUserTodos()
  const { control, handleSubmit, reset, resetField } = useForm<ICreateTodo>()
  const { mutateAsync: createTodo, isPending: isPenginsCreateTodo } = useCreateTodo()
  const { mutateAsync: markAll, isPending: isPendingMarkAll } = useMarkAll()
  const [isAdd, setIsAdd] = useState(false)

  const openAdd = () => setIsAdd(true)
  const closeAdd = () => setIsAdd(false)

  const onSubmit: SubmitHandler<ICreateTodo> = async (values) => {
    await createTodo(values, {
      onSuccess: () => {
        reset()
        closeAdd()
      },
    })
  }

  const handleMarkAll = async (event: ChangeEvent<HTMLInputElement>) => {
    await markAll({
      isDone: event.target.checked,
    })
  }

  const isEmpty = !todos || todos?.length === 0
  let total = todos?.length
  let donedCount = todos?.filter((item) => item.isDone).length
  return (
    <div className="!hide-scrollbar card relative h-full min-h-52 overflow-y-auto bg-base-300 sm:min-h-64 xl:min-h-max">
      <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
        <h2 className="mb-4 pt-2 text-center text-lg text-success">لیست کارهای مهم امروز</h2>
        {!isEmpty && (
          <div className="absolute end-4 top-3">
            <button onClick={openAdd} className="btn btn-success btn-xs">
              افزودن
            </button>
          </div>
        )}
      </div>
      <ul className="list-disc space-y-2 text-pretty p-2 text-sm">
        {isPending && (
          <div className="animate-pulse space-y-2">
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/55 backdrop-blur" />
          </div>
        )}

        {isEmpty && !isAdd && !isPending && (
          <div className="flex min-h-full flex-col items-center justify-center gap-2 md:min-h-40">
            <h4>کاری اضافه نکردی</h4>
            <button onClick={openAdd} className="btn btn-success btn-xs">
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
                        className="textarea textarea-success textarea-sm w-full"
                        placeholder="عنوان کار را وارد کنید"
                      />
                      {fieldState.error?.message && (
                        <span className="mt-2 text-xs text-error">{fieldState.error?.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <label className="label">زمان (اختیاری)</label>
                <Controller
                  control={control}
                  name="time"
                  defaultValue=""
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
                        }}
                        placeholder="زمان را وارد کنید"
                        className={cn(
                          'input input-sm input-success w-full text-center placeholder:text-start',
                          rest.value && 'ps-6'
                        )}
                      />
                      {rest.value && (
                        <button
                          onClick={() => resetField('time')}
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
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  disabled={isPenginsCreateTodo}
                  type="submit"
                  className="btn btn-success btn-xs"
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
                  checked={todos?.every((item) => item.isDone)}
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

        {todos?.map((todo) => (
          <TodoItem
            key={todo._id.toString()}
            id={todo._id.toString()}
            title={todo.title}
            isDone={todo.isDone}
            time={todo.time}
          />
        ))}
      </ul>
    </div>
  )
}
