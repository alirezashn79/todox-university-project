"use client";
import { fireSwal } from "@/utils/swal";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Warning() {
  const isChecked = useRef<boolean>(false);
  useEffect(() => {
    if (!localStorage.getItem("gurst_warning")) {
      fireSwal({
        titleText: "توجه!",
        html: (
          <div>
            <div className="text-justify">
              صفحه مهمان برای تست است و داده های شما در دیتابیس ذخیره نمیشود!
              برای ذخیره داده های خود می توانید
              <Link
                href="/auth/login-register"
                className="mx-1.5 inline-block text-[#facea8]"
              >
                ثبت نام
              </Link>
              کنید.
            </div>
            <div className="form-control mt-2">
              <label className="label w-fit flex items-center gap-2 ms-auto cursor-pointer">
                <span className="label-text">دیگر نمایش نده</span>
                <input
                  defaultChecked={isChecked.current}
                  onChange={() => (isChecked.current = !isChecked.current)}
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                />
              </label>
            </div>
          </div>
        ),
        confirmButtonText: "فهمیدم",
        icon: "warning",
      }).then(() => {
        if (isChecked.current) {
          localStorage.setItem(
            "gurst_warning",
            JSON.stringify(isChecked.current)
          );
        }
      });
    }
  }, []);
  return null;
}
