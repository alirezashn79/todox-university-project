'use client'
import { ChangeEvent, useState } from 'react'
import Flatpickr from 'react-flatpickr'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { convertToPersianTimeWithEnglishNumbers } from '@/utils/clientHelpers'
import { cn } from '@/utils/cn'
import { useGetUserAppointments } from '@/hooks/queries/appointments/useGetUserAppointments'
import {
  ICreateAppointmentInput,
  useCreateAppointment,
} from '@/hooks/queries/appointments/useCreateAppointment'
import useMarkAllAppointments from '@/hooks/queries/appointments/useMarkAll'
import AppointmentItem from './AppointmentItem'

export default function AppointmentSection() {
  const { data: appointments, isPending, isRefetching } = useGetUserAppointments()
  const { control, handleSubmit, reset, resetField } = useForm<ICreateAppointmentInput>()
  const { mutateAsync: createAppointment, isPending: isPenginsCreateAppointment } =
    useCreateAppointment()
  const { mutateAsync: markAll, isPending: isPendingMarkAll } = useMarkAllAppointments()
  const [isAdd, setIsAdd] = useState(false)

  const openAdd = () => setIsAdd(true)
  const closeAdd = () => setIsAdd(false)

  const onSubmit: SubmitHandler<ICreateAppointmentInput> = async (values) => {
    await createAppointment(values, {
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

  const isEmpty = !appointments || appointments?.length === 0
  let total = appointments?.length
  let donedCount = appointments?.filter((item) => item).length

  return (
    <div className="!hide-scrollbar card h-full min-h-80 overflow-hidden bg-base-300 md:h-40 xl:h-full xl:min-h-max">
      <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
        <h2 className="mb-4 pt-2 text-center text-lg text-primary">قرار ملاقات / یادآوری روز</h2>
        {!isEmpty && (
          <div className="absolute end-4 top-3">
            <button onClick={openAdd} className="btn btn-primary btn-xs">
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
            <h4>قرار یا یادآوری اضافه نکردی</h4>
            <button onClick={openAdd} className="btn btn-primary btn-xs">
              افزودن
            </button>
          </div>
        )}

        {isAdd && (
          <div className="bg-base-100 p-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="label">عنوان قرار</label>
                <Controller
                  control={control}
                  name="title"
                  defaultValue=""
                  rules={{
                    required: { value: true, message: 'عنوان الزامی است' },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        {...field}
                        autoFocus
                        className="input input-sm input-primary w-full"
                        placeholder="عنوان قرار را وارد کنید"
                      />
                      {fieldState.error?.message && (
                        <span className="mt-2 text-xs text-error">{fieldState.error?.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <label className="label">توضیحات (اختیاری)</label>
                <Controller
                  control={control}
                  name="description"
                  defaultValue=""
                  rules={{
                    required: false,
                    minLength: 4,
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <textarea
                        {...field}
                        className="textarea textarea-primary textarea-sm w-full"
                        placeholder="توضیحات را وارد کنید"
                      />
                      {fieldState.error?.message && (
                        <span className="mt-2 text-xs text-error">{fieldState.error?.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <label className="label">زمان</label>
                <Controller
                  control={control}
                  name="time"
                  defaultValue=""
                  rules={{
                    required: { value: true, message: 'زمان الزامی است' },
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
                          'input input-sm input-primary w-full text-center placeholder:text-start',
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
                  disabled={isPenginsCreateAppointment}
                  type="submit"
                  className="btn btn-primary btn-xs"
                >
                  {!isPenginsCreateAppointment ? (
                    'ثبت'
                  ) : (
                    <div className="size-3 animate-spin rounded-full border-t-2" />
                  )}
                </button>
                <button
                  disabled={isPenginsCreateAppointment}
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
                  checked={appointments?.every((item) => item.isDone)}
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

        {appointments?.map((appointment) => (
          <AppointmentItem
            key={appointment._id.toString()}
            id={appointment._id.toString()}
            title={appointment.title}
            isDone={appointment.isDone}
            time={appointment.time}
            description={appointment.description}
          />
        ))}
      </div>
    </div>
  )
}
