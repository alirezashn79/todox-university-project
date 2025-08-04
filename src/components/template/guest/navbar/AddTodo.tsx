'use client'

import Button from '@/components/modules/Button'
import Input from '@/components/modules/input'
import { zTodoSchemaClient } from '@/schemas/schema'
import useDateStore from '@/stores/DateStore'
import useGuest from '@/stores/GuestStore'
import useTheme from '@/stores/ThemeStore'
import {
  convertPersianDateToEnglishNumbers,
  convertToPersianTimeWithEnglishNumbers,
} from '@/utils/clientHelpers'
import { FireToast } from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/utils/cn'
import { useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import DatePicker from 'react-multi-date-picker'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css'
import 'react-multi-date-picker/styles/layouts/mobile.css'
import { TypeOf } from 'zod'

type TTodo = TypeOf<typeof zTodoSchemaClient>

export default function AddTodo() {
  const modal = useRef<any>()
  const theme = useTheme((state) => state.theme)
  const date = useDateStore((state) => state.date)
  const [TimeValue, setTimeValue] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const addTodo = useGuest((state) => state.addTodo)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TTodo>({
    resolver: zodResolver(zTodoSchemaClient),
  })
  const addTodoHandler: SubmitHandler<TTodo> = async (values) => {
    try {
      setLoading(true)
      addTodo({
        title: values.title,
        date: convertPersianDateToEnglishNumbers(date),
        time: convertToPersianTimeWithEnglishNumbers(TimeValue as Date),
      })
      setTimeout(() => {
        reset()
        setLoading(false)
        modal.current.close()
        FireToast({ type: 'success', message: 'ثبت شد' })
      }, 500)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <dialog ref={modal} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative !h-auto">
          <h3 className="text-lg font-bold">اضافه کردن کار</h3>
          <form onSubmit={handleSubmit(addTodoHandler)}>
            <div className="modal-middle mt-8 space-y-4">
              <Input
                name="title"
                register={register('title')}
                label="عنوان"
                errors={errors}
                placeholder="عنوان رو وارد کن"
              />

              <div className="form-control">
                <label className="label">
                  <span className={cn('label-text')}>زمان</span>
                </label>
                <div className="relative">
                  <DatePicker
                    calendarPosition="top-center"
                    value={TimeValue}
                    onChange={(e) => setTimeValue(e?.toDate() as any)}
                    disableDayPicker
                    containerClassName="w-full"
                    format="HH:mm"
                    className={cn(theme === 'dark' ? 'bg-dark' : '')}
                    plugins={[<TimePicker hideSeconds />]}
                    render={(value, openCalendar) => (
                      <input
                        value={value}
                        readOnly
                        onClick={() => {
                          openCalendar()
                        }}
                        type="text"
                        className={cn(
                          'input input-bordered w-full'
                          // timeError ? "input-error" : "input"
                        )}
                        placeholder="ساعت؟"
                      />
                    )}
                  />
                  {!!TimeValue && (
                    <div className="absolute bottom-0 end-4 top-0 flex items-center justify-center">
                      <button type="button" onClick={() => setTimeValue(null)}>
                        ❌
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Button
                text="اضافه کردن"
                disabled={loading}
                loading={loading}
                className="btn btn-primary absolute bottom-6 end-28"
              />
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => {
                  reset()
                  setTimeValue(null)
                }}
                className="btn"
              >
                بستن
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="flex-none gap-2">
        <button
          disabled={new Date(date.toDateString()) < new Date(new Date().toDateString())}
          onClick={() => modal.current.showModal()}
          className="btn btn-primary btn-sm md:btn-md"
        >
          اضافه کردن
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </>
  )
}
