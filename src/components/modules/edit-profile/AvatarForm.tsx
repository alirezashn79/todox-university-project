"use client";

import { zClientImageSchema } from "@/schemas/schema";
import { IUser } from "@/types";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn-func";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeOf } from "zod";
import Button from "../Button";
import client from "@/utils/client";
import { FireToast } from "@/utils/toast";

type TAvatar = TypeOf<typeof zClientImageSchema>;

export default function AvatarForm({ user }: { user: IUser }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TAvatar>({
    resolver: zodResolver(zClientImageSchema),
  });

  const handleChangeAvatar: SubmitHandler<TAvatar> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("avatar", values.avatar[0]);
      await client.post("api/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      FireToast({
        type: "success",
        message: "عکس پروفایل با موفقیت تغییر کرد",
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleChangeAvatar)}>
      <div className="flex items-center flex-col gap-8">
        <label className="flex items-center justify-center label cursor-pointer">
          <input
            type="file"
            className="hidden"
            {...register("avatar")}
            onChange={async (e) => {
              await register("avatar").onChange(e);
              handleAvatar(e);
            }}
          />
          {watch("avatar") ? (
            <div className="avatar">
              <div
                className={cn(
                  "ring-primary ring-offset-base-100 w-40 lg:w-64 rounded-full ring ring-offset-2",
                  errors.avatar?.message ? "border-4 border-error" : ""
                )}
              >
                <img src={imagePreview as string} />
              </div>
            </div>
          ) : (
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-40 lg:w-64 rounded-full ring ring-offset-2">
                <img src={user?.avatar} />
              </div>
            </div>
          )}
        </label>

        <ErrorMessage
          errors={errors}
          name="avatar"
          render={({ message }) => (
            <span className="mt-2 text-error">{message}</span>
          )}
        />

        <div className="flex items-center gap-4">
          <Button
            text="تغییر عکس"
            loading={isSubmitting}
            disabled={!watch("avatar")}
          />
          {!!watch("avatar") && (
            <Button
              type="button"
              text="لغو"
              loading={isSubmitting}
              disabled={!watch("avatar")}
              className="btn-error btn-outline"
              onClick={reset}
            />
          )}
        </div>
      </div>
    </form>
  );
}
