'use client'
import TodoStateStyle from '@/components/modules/TodoStateStyle'
import useDateStore from '@/stores/DateStore'
import { ITodo } from '@/types'
import { convertPersianDateToEnglishNumbers } from '@/utils/clientHelpers'
import Image from 'next/image'
import { PulseLoader } from 'react-spinners'
import { useSwipeable } from 'react-swipeable'
import useSWR from 'swr'
import AllCheckTodos from './AllCheckTodos'
import DeleteTodo from './DeleteTodo'
import EditTodo from './EditTodo'
import ToggleDoneTodo from './ToggleDoneTodo'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Table() {
  const date = useDateStore((state) => state.date)
  const changeDate = useDateStore((state) => state.changeDate)

  const { data, error, isLoading } = useSWR<ITodo[]>(
    date ? `/api/user/todos/${convertPersianDateToEnglishNumbers(date)}` : null,
    date ? fetcher : null
  )

  const handlers = useSwipeable({
    onSwipedLeft: () => changeDate(new Date(date.setDate(date.getDate() - 1))),
    onSwipedRight: () => changeDate(new Date(date.setDate(date.getDate() + 1))),
    trackMouse: true,
  })

  const errorEl = (
    <div className="mx-auto mt-32 flex max-w-lg select-none flex-col items-center justify-center py-10 lg:mt-24">
      <p className="mt-2 text-center text-xl font-semibold text-gray-500">خطا در اتصال</p>
    </div>
  )

  const loadingEl = (
    <div
      {...handlers}
      className="flex w-full select-none items-center justify-center py-52 text-primary lg:py-36"
    >
      <PulseLoader color="#7480ff" size={18} margin={8} />
    </div>
  )

  const noTodoEl = (
    <div {...handlers} className="w-full select-none py-20 text-gray-500">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image
            unoptimized
            height={200}
            width={200}
            src="/img/empty.png"
            alt="empty"
            className="pointer-events-none"
          />
          <p className="mt-2 text-center text-xl font-semibold text-gray-500">
            هنوز هیچ کاری اضافه نکردی!
          </p>
          <div className="mt-1.5 flex items-center text-xs text-gray-500">
            برای جابجا شدن بین روزهای هفته به
            <span className="mx-1 text-sm font-bold"> چپ </span>و
            <span className="ms-1 text-sm font-bold"> راست </span>
            <span className="px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 animate-bounce"
              >
                <path
                  fillRule="evenodd"
                  d="M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            بکشید
          </div>
        </div>
      </div>
    </div>
  )

  const todoEl = (
    <section>
      <TodoStateStyle data={data as ITodo[]} />
      <div {...handlers} className="min-h-96 select-none overflow-x-auto">
        <table className="table table-zebra overflow-hidden rounded-t-lg">
          {/* head */}
          <thead className="bg-[#7480ff]/10 text-xs lg:text-sm">
            <tr>
              <th>
                <AllCheckTodos checkAll={data?.every((item) => item.isDone) || false} />
              </th>
              <th>عنوان</th>

              <th className="text-center">زمان</th>
              <th className="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-base lg:text-lg">
            {/* row 1 */}
            {data?.map((item) => (
              <tr key={item._id.toString()}>
                <th>
                  <ToggleDoneTodo id={item._id} isDone={item.isDone} />
                </th>
                <td className="text-justify">{item.title}</td>

                <td className="text-center">{item.time || '-:-'}</td>

                <th>
                  <div className="flex items-center justify-center gap-4">
                    <EditTodo _id={item._id} time={item.time} title={item.title} />
                    <DeleteTodo id={item._id} />
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )

  if (isLoading) return loadingEl
  if (!data?.length) return noTodoEl
  if (error) return errorEl
  return todoEl
}
