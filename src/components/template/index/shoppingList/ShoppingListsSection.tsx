'use client'
import Card from '@/components/modules/Card'
import {
  ICreateShoppingItemInput,
  useCreateShoppingItem,
} from '@/hooks/queries/shoppingLists/useCreateShoppingList'
import { useGetUserShoppingItems } from '@/hooks/queries/shoppingLists/useGetUserShoppingLists'
import { useMarkAllShoppingItems } from '@/hooks/queries/shoppingLists/useMarkAllShoppingList'
import { ChangeEvent, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import ShoppingItem from './ShoppingListItem'

export default function ShoppingListSection() {
  const { data: shoppingList, isPending, isRefetching } = useGetUserShoppingItems()
  const { control, handleSubmit, reset } = useForm<ICreateShoppingItemInput>()
  const { mutateAsync: createShopping, isPending: isPenginsCreateShopping } =
    useCreateShoppingItem()
  const { mutateAsync: markAll, isPending: isPendingMarkAll } = useMarkAllShoppingItems()
  const [isAdd, setIsAdd] = useState(false)

  const openAdd = () => setIsAdd(true)
  const closeAdd = () => setIsAdd(false)

  const onSubmit: SubmitHandler<ICreateShoppingItemInput> = async (values) => {
    await createShopping(values, {
      onSuccess: () => {
        reset()
        closeAdd()
      },
    })
  }

  const handleMarkAll = async (event: ChangeEvent<HTMLInputElement>) => {
    await markAll({
      isPurchased: event.target.checked,
    })
  }

  const isEmpty = !shoppingList || shoppingList?.length === 0
  let total = shoppingList?.length
  let donedCount = shoppingList?.filter((item) => item.isPurchased).length

  return (
    <Card
      theme="info"
      title="لیست خرید"
      className="lg:col-span-2 xl:col-span-1"
      onAddClick={openAdd}
      isShowAddButton={!isEmpty}
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
          <h4>خریدی اضافه نکردی</h4>
          <button onClick={openAdd} className="btn btn-info btn-xs">
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
                name="name"
                defaultValue=""
                rules={{
                  required: { value: true, message: 'عنوان الزامی است' },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      {...field}
                      autoFocus
                      className="input input-sm input-info w-full"
                      placeholder="عنوان را وارد کنید"
                    />
                    {fieldState.error?.message && (
                      <span className="mt-2 text-xs text-error">{fieldState.error?.message}</span>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex items-center gap-2">
              <div>
                <label className="label">تعداد (اختیاری)</label>
                <Controller
                  control={control}
                  name="quantity"
                  defaultValue={0}
                  rules={{
                    required: false,
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        {...field}
                        type="number"
                        className="input input-sm input-info w-full"
                        placeholder="تعداد را وارد کنید"
                      />
                      {fieldState.error?.message && (
                        <span className="mt-2 text-xs text-error">{fieldState.error?.message}</span>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <label className="label">قیمت (اختیاری)</label>
                <Controller
                  control={control}
                  name="price"
                  defaultValue={0}
                  rules={{
                    required: false,
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        {...field}
                        type="number"
                        className="input input-sm input-info w-full"
                        placeholder="قیمت را وارد کنید"
                      />
                      {fieldState.error?.message && (
                        <span className="mt-2 text-xs text-error">{fieldState.error?.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="label">توضیحات</label>
              <Controller
                control={control}
                name="reason"
                defaultValue=""
                rules={{
                  required: false,
                }}
                render={({ field, fieldState }) => (
                  <>
                    <textarea
                      {...field}
                      className="textarea textarea-info textarea-sm w-full"
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
                disabled={isPenginsCreateShopping}
                type="submit"
                className="btn btn-info btn-xs"
              >
                {!isPenginsCreateShopping ? (
                  'ثبت'
                ) : (
                  <div className="size-3 animate-spin rounded-full border-t-2" />
                )}
              </button>
              <button
                disabled={isPenginsCreateShopping}
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
                checked={shoppingList?.every((item) => item.isPurchased)}
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
        shoppingList?.map((shopping) => (
          <ShoppingItem
            key={shopping._id.toString()}
            id={shopping._id.toString()}
            name={shopping.name}
            isPurchased={shopping.isPurchased}
            reason={shopping.reason}
            quantity={shopping.quantity}
            price={shopping.price}
          />
        ))}
    </Card>
  )
}
