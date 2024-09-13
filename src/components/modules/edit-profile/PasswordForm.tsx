"use client";
import { zPass } from "@/schemas/schema";
import client from "@/utils/client";
import { FireToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeOf } from "zod";
import Button from "../Button";
import Input from "../input";

type TPass = TypeOf<typeof zPass>;

export default function PasswordForm() {
  const { replace } = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TPass>({
    resolver: zodResolver(zPass),
  });

  const onSubmit: SubmitHandler<TPass> = async (values) => {
    try {
      await client.put("api/user/edit-profile/password", {
        newPass: values.confirmPass,
      });
      reset();
      await client.get("api/auth/logout");
      replace("/auth/login-with-password");
      FireToast({
        type: "success",
        message: "رمزعبور تغییر کرد، محددا لاگین کنید",
      });
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          errors={errors}
          label="رمزعبور جدید"
          name="newPass"
          register={register("newPass")}
          placeholder="رمزعبور جدید را وارد کنید"
          type="password"
        />

        <Input
          errors={errors}
          label="تکرار رمزعبور جدید"
          name="confirmPass"
          register={register("confirmPass")}
          placeholder="رمزعبور جدید را تکرار کنید"
          type="password"
        />

        <div className="form-control">
          <Button className="sm:mt-9" loading={isSubmitting} text="ثبت" />
        </div>
      </div>
    </form>
  );
}
