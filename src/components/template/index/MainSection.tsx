import React from 'react'

export default function MainSection() {
  return (
    <div className="hide-scrollbar h-[calc(100vh-200px)] overflow-y-hidden">
      <div className="grid h-full grid-cols-4 gap-4 pt-2">
        <div className="h-full">
          <div className="!hide-scrollbar card h-full max-h-full overflow-y-auto bg-base-300">
            <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
              <h2 className="mb-4 pt-2 text-center text-lg">لیست کارهای مهم امروز</h2>
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
          <div className="!hide-scrollbar card basis-2/4 overflow-y-auto bg-base-300">
            <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
              <h2 className="mb-4 pt-2 text-center text-lg">لیست خرید</h2>
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
          <div className="!hide-scrollbar card basis-2/4 overflow-y-auto bg-base-300">
            <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
              <h2 className="mb-4 pt-2 text-center text-lg">مهم روز</h2>
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
          <div className="!hide-scrollbar card basis-2/3 overflow-y-auto bg-base-300">
            <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
              <h2 className="mb-4 pt-2 text-center text-lg">اهداف روز</h2>
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
          <div className="!hide-scrollbar card basis-1/3 overflow-y-auto bg-base-300">
            <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
              <h2 className="mb-4 pt-2 text-center text-lg">قرار ملاقات / یادآوری روز</h2>
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
          <div className="!hide-scrollbar card basis-2/3 overflow-y-auto bg-base-300">
            <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
              <h2 className="mb-4 pt-2 text-center text-lg">یادداشت</h2>
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
          <div className="!hide-scrollbar card basis-1/3 overflow-y-auto bg-base-300">
            <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
              <h2 className="mb-4 pt-2 text-center text-lg">حال روز</h2>
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
      </div>
    </div>
  )
}
