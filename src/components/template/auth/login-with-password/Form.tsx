"use client";
import Input from "@/components/modules/input";
import { zSignInForm } from "@/schemas/schema";
import useTheme from "@/stores/ThemeStore";
import client from "@/utils/client";
import { FireToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TypeOf } from "zod";

type TLoginWithPassForm = TypeOf<typeof zSignInForm>;

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginWithPassForm>({
    resolver: zodResolver(zSignInForm),
  });
  const theme = useTheme((state) => state.theme);
  const { replace } = useRouter();

  const handleLogin: SubmitHandler<TLoginWithPassForm> = async (values) => {
    const loading = FireToast({ type: "loading", message: "صبر کنید..." });
    try {
      await client.post("/api/auth/login", values);
      FireToast({ type: "success", message: "تایید شد." });
      replace("/");
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(loading);
    }
  };
  return (
    <div className="card-body">
      <form onSubmit={handleSubmit(handleLogin)}>
        <Input
          name="identifier"
          register={register("identifier")}
          label="ایمیل یا شماره موبایل"
          errors={errors}
          placeholder="ایمیل یا شمارتو وارد کن"
          dir="ltr"
        />

        <Input
          name="password"
          register={register("password")}
          label="رمز عبور"
          errors={errors}
          placeholder="رمزتو وارد کن"
          dir="ltr"
          type="password"
        />

        <div className="form-control mt-6">
          <button disabled={isSubmitting} className="btn btn-primary">
            ورود
          </button>
        </div>
      </form>

      <div className="flex justify-around gap-1 text-right mt-4">
        <Link className="btn w-fit" href="/auth/login-register">
          ورود یا ثبت نام با شماره
        </Link>
        <Link className="btn w-fit" href="/guest">
          ورود به عنوان مهمان
        </Link>
      </div>
    </div>
  );
}
