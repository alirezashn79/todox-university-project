import 'flatpickr/dist/themes/material_green.css'
import dynamic from 'next/dynamic'
import MoodReactions from './MoodReactions'
const TodoSection = dynamic(() => import('./todo/TodoSection'))
const GoalSection = dynamic(() => import('./goal/GoalSection'))
const AppointmentSection = dynamic(() => import('./Appointment/AppointmentSection'))
const ShoppingListSection = dynamic(() => import('./shoppingList/shoppingListSection'))

export default function MainSection() {
  return (
    <div className="hide-scrollbar overflow-y-auto xl:h-[calc(100vh-200px)]">
      <div className="grid h-full grid-cols-1 gap-4 pt-2 md:grid-cols-2 xl:grid-cols-4">
        <TodoSection />

        <div className="grid h-full grid-cols-1 gap-2 overflow-hidden xl:grid-rows-2">
          <GoalSection />
          <AppointmentSection />
        </div>

        <div className="flex h-full flex-col gap-2">
          <ShoppingListSection />
          <div className="!hide-scrollbar card min-h-52 overflow-y-auto bg-base-300 sm:min-h-64 xl:h-auto xl:min-h-max xl:basis-2/4">
            <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
              <h2 className="mb-4 pt-2 text-center text-lg text-error">مهم روز</h2>
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
                    اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ
                    متن نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها
                    به‌نوعی وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود
                    را صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
                  </p>
                </label>
              </li>
            </ul>
          </div>
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
                    اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ
                    متن نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها
                    به‌نوعی وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود
                    را صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
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
                    اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ
                    متن نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها
                    به‌نوعی وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود
                    را صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
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
                    اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ
                    متن نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها
                    به‌نوعی وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود
                    را صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
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
                    اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ
                    متن نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها
                    به‌نوعی وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود
                    را صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
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
                    اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ
                    متن نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها
                    به‌نوعی وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود
                    را صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
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
            {/* <ul className="list-disc space-y-4 text-pretty p-2 text-sm">
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
                    اندازه‌بندی‌ها چگونه در نظر گرفته شده‌است. از آنجایی که طراحان عموماً نویسندهٔ
                    متن نیستند و وظیفهٔ رعایت حق تکثیر متون را ندارند و در همان حال، کار آن‌ها
                    به‌نوعی وابسته به متن است، آن‌ها با استفاده از محتویات ساختگی، صفحهٔ گرافیکی خود
                    را صفحه‌آرایی می‌کنند تا مرحلهٔ طراحی و صفحه‌بندی را به پایان برند.
                  </p>
                </label>
              </li>
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  )
}
