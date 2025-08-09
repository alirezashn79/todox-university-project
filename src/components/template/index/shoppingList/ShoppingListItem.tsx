'use client'

import { useDeleteShoppingItem } from '@/hooks/queries/shoppingLists/useDeleteShoppingList'
import {
  IUpdateShoppingItemInput,
  useUpdateShoppingItem,
} from '@/hooks/queries/shoppingLists/useUpdateShoppingList'
import { cn } from '@/utils/cn'
import { compact } from '@/utils/compact'
import { fireConfirmSwal } from '@/utils/swal'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface IProps {
  id: string
  name: string
  isPurchased: boolean
  reason?: string
  quantity?: number
  price?: number
}

type IUpdateShoppingForm = Omit<IUpdateShoppingItemInput, 'id'>

export default function ShoppingItem({ id, name, isPurchased, price, quantity, reason }: IProps) {
  const [isShow, setIsShow] = useState(false)
  const [isChecked, setIsChecked] = useState(isPurchased)
  const [isEdit, setIsEdit] = useState(false)
  const { control, handleSubmit, resetField, reset } = useForm<IUpdateShoppingForm>()

  const handleUpdateShopping: SubmitHandler<IUpdateShoppingForm> = async (values) => {
    await UpdateShopping(
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

  const { mutateAsync: UpdateShopping, isPending: isPendingUpdateShopping } =
    useUpdateShoppingItem()
  const { mutateAsync: deleteShopping, isPending: isPendingDeleteShopping } =
    useDeleteShoppingItem()

  const handleEdit = async () => {
    if (!isEdit) {
      setIsEdit(true)
      setIsChecked(false)
      return
    }
    handleSubmit(handleUpdateShopping)()
  }

  useEffect(() => {
    if (isChecked) {
      setIsShow(false)
      setIsEdit(false)
    }
  }, [isChecked, setIsShow])

  useEffect(() => {
    setIsChecked(isPurchased)
  }, [isPurchased])

  const handleChangeIsDone = async (e: ChangeEvent<HTMLInputElement>) => {
    await UpdateShopping(
      {
        id,
        isPurchased: e.target.checked,
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
      successFunctionVoid: () => deleteShopping({ id }),
      successText: 'حذف شد',
    })
  }

  return (
    <li
      className={cn(
        'flex cursor-pointer items-start gap-2 rounded-lg bg-base-100 p-2 transition-all hover:border hover:border-slate-400 hover:bg-base-200',
        isShow && 'border border-slate-400 bg-base-200',
        isChecked && 'border border-info !bg-info/5',
        isPendingDeleteShopping && 'animate-pulse border border-error bg-error/20'
      )}
    >
      {isPendingUpdateShopping || isPendingDeleteShopping ? (
        <div
          className={cn(
            'checkbox-xs size-4 animate-spin rounded-full border-t-[9px] border-t-info',
            isPendingDeleteShopping && '!checkbox-error'
          )}
        />
      ) : (
        <label className="w-fit translate-y-0.5">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChangeIsDone}
            className="checkbox-info checkbox checkbox-xs"
          />
        </label>
      )}
      <div
        onClick={() => {
          if (!isShow) setIsShow(true)
        }}
        className="grow transition-all"
      >
        <form className="flex flex-col items-start gap-2">
          <div className="w-full">
            {isEdit ? (
              <Controller
                control={control}
                name="name"
                defaultValue={name}
                rules={{
                  required: false,
                  minLength: 1,
                }}
                render={({ field, fieldState }) => (
                  <>
                    <label className="label">عنوان</label>
                    <input
                      {...field}
                      autoFocus
                      className="input input-sm input-info w-full leading-5"
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
                  isChecked && 'text-info line-through'
                )}
              >
                {name}
              </p>
            )}
          </div>

          <div className="flex w-full items-center gap-2">
            <div className="w-1/2">
              {isEdit ? (
                <Controller
                  control={control}
                  name="quantity"
                  defaultValue={0}
                  rules={{
                    required: false,
                    minLength: 1,
                  }}
                  render={({ field: { value, ...rest }, fieldState }) => (
                    <>
                      <label className="label">تعداد</label>
                      <input
                        {...rest}
                        value={value ?? 0}
                        type="number"
                        className="input input-sm input-info w-full text-center leading-5"
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
                    isChecked && 'text-info line-through'
                  )}
                >
                  تعداد: {quantity}
                </p>
              )}
            </div>
            <div className="w-1/2">
              {isEdit ? (
                <Controller
                  control={control}
                  name="price"
                  defaultValue={0}
                  rules={{
                    required: false,
                    minLength: 1,
                  }}
                  render={({ field: { value, ...rest }, fieldState }) => (
                    <>
                      <label className="label">قیمت</label>
                      <input
                        {...rest}
                        value={value ?? 0}
                        type="number"
                        className="input input-sm input-info w-full text-center leading-5"
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
                    isChecked && 'text-info line-through'
                  )}
                >
                  قیمت: {price}
                </p>
              )}
            </div>
          </div>

          <div className="w-full">
            {isEdit ? (
              <Controller
                control={control}
                name="reason"
                defaultValue={reason}
                rules={{
                  required: false,
                  minLength: 1,
                }}
                render={({ field: { value, ...rest }, fieldState }) => (
                  <>
                    <label className="label">توضیحات</label>
                    <textarea
                      {...rest}
                      value={value ?? ''}
                      className="textarea textarea-info textarea-sm min-h-20 w-full px-2 text-start leading-5"
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
                  'line-clamp-2 grow select-none text-xs',
                  isShow && 'line-clamp-none',
                  isChecked && 'text-info line-through'
                )}
              >
                {reason}
              </p>
            )}
          </div>
        </form>

        {isShow && (
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className={cn('btn btn-info btn-xs', isEdit && '!btn-info')}
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
