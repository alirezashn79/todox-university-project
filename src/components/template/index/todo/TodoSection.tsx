'use client'
import useGetUserTodos from '@/hooks/queries/todos/useGetUserTodos'
import TodoItem from './todoItem'
import { useState } from 'react'
import Flatpickr from 'react-flatpickr'
import useCreateTodo, { ICreateTodo } from '@/hooks/queries/todos/useCreateTodo'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { convertToPersianTimeWithEnglishNumbers } from '@/utils/clientHelpers'
import { cn } from '@/utils/cn'

export default function TodoSection() {
  const { data: todos, isPending } = useGetUserTodos()
  const { control, handleSubmit, reset, resetField } = useForm<ICreateTodo>()
  const { mutateAsync: createTodo } = useCreateTodo()
  const [isAdd, setIsAdd] = useState(false)

  const openAdd = () => setIsAdd(true)
  const closeAdd = () => setIsAdd(false)
  const toggledd = () => setIsAdd((prev) => !prev)

  const onSubmit: SubmitHandler<ICreateTodo> = async (values) => {
    await createTodo(values, {
      onSuccess: () => {
        reset()
        closeAdd()
      },
    })
  }

  const isEmpty = todos?.length === 0
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
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/50 backdrop-blur" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/50 backdrop-blur" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/50 backdrop-blur" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-base-100/50 backdrop-blur" />
          </div>
        )}

        {isEmpty && !isAdd && (
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
                <button type="submit" className="btn btn-success btn-xs">
                  ثبت
                </button>
                <button onClick={closeAdd} type="button" className="btn btn-error btn-xs">
                  لغو
                </button>
              </div>
            </form>
          </div>
        )}

        {todos?.map((todo) => (
          <TodoItem
            key={todo._id.toString()}
            title={todo.title}
            isDone={todo.isDone}
            time={todo.time}
          />
        ))}
      </ul>
    </div>
  )
}
