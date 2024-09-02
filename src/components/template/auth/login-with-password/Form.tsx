"use client";
import { zSignInForm } from "@/schemas/schema";
import useTheme from "@/stores/ThemeStore";
import client from "@/utils/client";
import { FireToast } from "@/utils/toast";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn-func";
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
        <div className="form-control">
          <label className="label">
            <span className="label-text">ایمیل یا شماره موبایل</span>
          </label>

          <input
            dir="ltr"
            {...register("identifier")}
            type="text"
            placeholder="ایمیل یا شمارتو وارد کن"
            className={cn(
              "input input-bordered w-full",
              errors.identifier?.message ? "input-error" : "input"
            )}
          />

          <ErrorMessage
            errors={errors}
            name="identifier"
            render={({ message }) => (
              <span className="text-error mt-2">{message}</span>
            )}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">رمزعبور</span>
          </label>

          <input
            dir="ltr"
            {...register("password")}
            type="password"
            placeholder="رمزتو وارد کن"
            className={cn(
              "input input-bordered w-full",
              errors.password?.message ? "input-error" : "input"
            )}
          />

          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <span className="text-error mt-2">{message}</span>
            )}
          />
        </div>

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
