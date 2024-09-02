"use client";
import { zSignInForm } from "@/schemas/schema";
import useTheme from "@/stores/ThemeStore";
import client from "@/utils/client";
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
    const loading = toast.loading("wating...", {
      style: {
        backgroundColor: theme === "dark" ? "#1d232a" : undefined,
        color: theme === "dark" ? "#a6adbb" : undefined,
        border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
      },
    });
    try {
      const res = await client.post("/api/auth/login", values);
      toast.success(res.data.message, {
        style: {
          backgroundColor: theme === "dark" ? "#1d232a" : undefined,
          color: theme === "dark" ? "#a6adbb" : undefined,
          border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
        },
      });
      replace("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message, {
          style: {
            backgroundColor: theme === "dark" ? "#1d232a" : undefined,
            color: theme === "dark" ? "#a6adbb" : undefined,
            border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
          },
        });
      }
    } finally {
      toast.dismiss(loading);
    }
  };
  return (
    <div className="card-body">
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email or Phone</span>
          </label>

          <input
            {...register("identifier")}
            type="text"
            placeholder="your email or phone..."
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
            <span className="label-text">password</span>
          </label>

          <input
            {...register("password")}
            type="password"
            placeholder="your password..."
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
            Login
          </button>
        </div>
      </form>

      <div className="flex justify-around gap-1 text-right mt-4">
        <Link className="btn w-fit" href="/guest">
          ورود به عنوان مهمان
        </Link>
        <Link className="btn w-fit" href="/auth/login-register">
          ورود یا ثبت نام با شماره
        </Link>
      </div>
    </div>
  );
}
