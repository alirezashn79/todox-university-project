"use client";

import Input from "@/components/modules/input";
import { zUserCreationClientSchema } from "@/schemas/schema";
import useGuest from "@/stores/GuestStore";
import client from "@/utils/client";
import { FireToast } from "@/utils/toast";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn-func";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TypeOf } from "zod";

type TUserProfile = TypeOf<typeof zUserCreationClientSchema>;

export default function Form() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const todos = useGuest((state) => state.todos);
  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUserProfile>({
    resolver: zodResolver(zUserCreationClientSchema),
  });

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const completeProfileHandler: SubmitHandler<TUserProfile> = async (
    values
  ) => {
    const loading = FireToast({ type: "loading", message: "صبر کنید..." });
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("username", values.username.toLocaleLowerCase());
      formData.append("password", values.password);
      if (avatar) {
        formData.append("avatar", values.avatar[0]);
        console.log(avatar);
      }
      await client.post("api/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      FireToast({ type: "success", message: "اطلاعات با موفقیت ثبت شد" });
      if (!!todos && todos.length > 0) {
        replace("/guest/transfer-data");
      } else {
        replace("/");
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      toast.dismiss(loading);
    }
  };
  return (
    <form onSubmit={handleSubmit(completeProfileHandler)} className="card-body">
      <label className="flex items-center justify-center label">
        <input
          type="file"
          className="hidden"
          {...register("avatar")}
          onChange={async (e) => {
            await register("avatar").onChange(e);
            handleAvatar(e);
          }}
        />
        {avatar ? (
          <div className="avatar">
            <div
              className={cn(
                "w-24 rounded-full",
                errors.avatar?.message ? "border-4 border-error" : ""
              )}
            >
              <img src={imagePreview as string} />
            </div>
          </div>
        ) : (
          <div className="avatar placeholder">
            <div
              className={cn(
                "bg-neutral text-neutral-content w-24 rounded-full",
                errors.avatar?.message ? "border-4 border-error" : ""
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </div>
          </div>
        )}
      </label>
      <p className="text-xs text-warning">
        در صورت تمایل به انتخاب عکس روی آیکن بالا کلیک کنید.
      </p>
      <ErrorMessage
        errors={errors}
        name="avatar"
        render={({ message }) => (
          <span className="mt-2 text-error">{message}</span>
        )}
      />

      <Input
        name="fullName"
        register={register("fullName")}
        label="نام"
        errors={errors}
        placeholder="اسمتو تایپ کن"
      />

      <Input
        name="username"
        register={register("username")}
        label="نام کاربری"
        errors={errors}
        placeholder="نام کاربری رو وارد کن"
      />

      <Input
        name="password"
        register={register("password")}
        type="password"
        label="رمز عبور"
        errors={errors}
        placeholder="یه رمز عبور برا خودت تایپ کن"
      />

      <div className="form-control mt-6">
        <button disabled={isSubmitting} className="btn btn-primary">
          ثبت
        </button>
      </div>
    </form>
  );
}
