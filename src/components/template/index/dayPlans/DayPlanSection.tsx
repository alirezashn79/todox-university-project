'use client'
import dynamic from 'next/dynamic'
import MoodReactions from '../MoodReactions'
import { useGetUserDayPlans } from '@/hooks/queries/dayPlans/useGetUserDayPlans'
import ImportantSection from './ImportantSection'
const ShoppingListSection = dynamic(() => import('../shoppingList/ShoppingListsSection'))

export default function DayPlanSection() {
  const {
    data: dayPlans,
    isPending: isPendingDayPlans,
    isRefetching: isRefetchingDayPlans,
  } = useGetUserDayPlans()

  return (
    <>
      <div className="flex h-full flex-col gap-2">
        <ShoppingListSection />
        <ImportantSection
          dayPlans={dayPlans}
          isPending={isPendingDayPlans}
          isRefetching={isRefetchingDayPlans}
        />
      </div>

      <div className="flex h-full flex-col gap-2">
        <div className="!hide-scrollbar card min-h-52 overflow-y-auto bg-base-300 sm:min-h-64 xl:h-auto xl:min-h-max xl:basis-3/4">
          <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
            <h2 className="mb-4 pt-2 text-center text-lg text-accent">یادداشت</h2>
          </div>

          <ul className="list-disc space-y-4 text-pretty p-2 text-sm">
            <li>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox-secondary checkbox checkbox-xs translate-y-1"
                />

                <p className="line-clamp-2 select-none">
                  معمولاً طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده
                  می‌کنند تا صرفاً به مشتری یا صاحب‌کار خود نشان دهند که صفحهٔ طراحی یا صفحه‌بندی
                  شده، بعد از اینکه متن در آن قرار گیرد، چگونه به نظر می‌رسد و قلم‌ها و
                  اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ متن
                  نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها به‌نوعی
                  وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود را
                  صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
                </p>
              </label>
            </li>
            <li>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox-secondary checkbox checkbox-xs translate-y-1"
                />

                <p className="line-clamp-2 select-none">
                  معمولاً طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده
                  می‌کنند تا صرفاً به مشتری یا صاحب‌کار خود نشان دهند که صفحهٔ طراحی یا صفحه‌بندی
                  شده، بعد از اینکه متن در آن قرار گیرد، چگونه به نظر می‌رسد و قلم‌ها و
                  اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ متن
                  نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها به‌نوعی
                  وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود را
                  صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
                </p>
              </label>
            </li>
            <li>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox-secondary checkbox checkbox-xs translate-y-1"
                />

                <p className="line-clamp-2 select-none">
                  معمولاً طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده
                  می‌کنند تا صرفاً به مشتری یا صاحب‌کار خود نشان دهند که صفحهٔ طراحی یا صفحه‌بندی
                  شده، بعد از اینکه متن در آن قرار گیرد، چگونه به نظر می‌رسد و قلم‌ها و
                  اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ متن
                  نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها به‌نوعی
                  وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود را
                  صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
                </p>
              </label>
            </li>
            <li>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox-secondary checkbox checkbox-xs translate-y-1"
                />

                <p className="line-clamp-2 select-none">
                  معمولاً طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده
                  می‌کنند تا صرفاً به مشتری یا صاحب‌کار خود نشان دهند که صفحهٔ طراحی یا صفحه‌بندی
                  شده، بعد از اینکه متن در آن قرار گیرد، چگونه به نظر می‌رسد و قلم‌ها و
                  اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ متن
                  نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها به‌نوعی
                  وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود را
                  صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
                </p>
              </label>
            </li>
            <li>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox-secondary checkbox checkbox-xs translate-y-1"
                />

                <p className="line-clamp-2 select-none">
                  معمولاً طراحان گرافیک برای صفحه‌آرایی، نخست از متن‌های آزمایشی و بی‌معنی استفاده
                  می‌کنند تا صرفاً به مشتری یا صاحب‌کار خود نشان دهند که صفحهٔ طراحی یا صفحه‌بندی
                  شده، بعد از اینکه متن در آن قرار گیرد، چگونه به نظر می‌رسد و قلم‌ها و
                  اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ متن
                  نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها به‌نوعی
                  وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود را
                  صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
                </p>
              </label>
            </li>
          </ul>
        </div>
        <div className="!hide-scrollbar card overflow-y-auto bg-base-300 md:basis-1/4">
          <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
            <h2 className="mb-4 pt-2 text-center text-lg text-secondary">حال روز</h2>
          </div>
          <MoodReactions />
        </div>
      </div>
    </>
  )
}
