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
  const { refresh } = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TPass>({
    resolver: zodResolver(zPass),
  });

  const onSubmit: SubmitHandler<TPass> = async (values) => {
    try {
      await client.put("api/user/edit-profile/password", {
        prevPass: values.prevPass,
        newPass: values.confirmPass,
      });
      reset();
      refresh();
      FireToast({
        type: "success",
        message: "رمزعبور تغییر کرد",
      });
    } catch (error: any) {
      if (!!error.response) {
        if (error.response.status === 400) {
          setError("prevPass", {
            message: "رمزعبور صحیح نیست",
          });
          setValue("prevPass", "");
        }
      }
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          errors={errors}
          label="رمزعبور فعلی"
          name="prevPass"
          register={register("prevPass")}
          placeholder="رمزعبور فعلی را وارد کنید"
          type="password"
        />

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
          <Button className=" sm:mt-9" loading={isSubmitting} text="ثبت" />
        </div>
      </div>
    </form>
  );
}
