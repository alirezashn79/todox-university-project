"use client";

import { zPhoneSchema } from "@/schemas/schema";
import client from "@/utils/client";
import { FireToast } from "@/utils/toast";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn-func";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import OTPInput from "react-otp-input";
import { TypeOf } from "zod";

type TPhoneSchema = TypeOf<typeof zPhoneSchema>;

export default function Sms() {
  const [otp, setOtp] = useState("");
  const [isSentCode, setIsSentCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TPhoneSchema>({
    resolver: zodResolver(zPhoneSchema),
  });

  const sendCodeHandler: SubmitHandler<TPhoneSchema> = async (values) => {
    const loading = FireToast({ type: "loading", message: "صبر کنید..." });
    try {
      setIsLoading(true);
      await client.post("/api/auth/sms/send", values);
      FireToast({ type: "success", message: "کد ارسال شد." });
      setIsSentCode(true);
      sessionStorage.setItem("phone", values.phone);
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 451) {
          setIsSentCode(true);
        }
        console.log(error);
      }
    } finally {
      toast.dismiss(loading);
      setIsLoading(false);
    }
  };

  const verifyCodeHandler = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const loading = FireToast({ type: "loading", message: "صبر کنید..." });

    try {
      setIsLoading(true);
      const phone = sessionStorage.getItem("phone");
      const res = await client.post("/api/auth/sms/verify", {
        phone,
        code: otp,
      });
      FireToast({ type: "success", message: "تایید شد." });
      sessionStorage.removeItem("phone");
      if (res.status === 200) {
        replace("/");
      } else if (res.status === 202) {
        replace("/complete-profile");
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(loading);
      setIsLoading(false);
    }
  };

  return (
    <div className="card-body">
      <form onSubmit={handleSubmit(sendCodeHandler)}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">شماره موبایل</span>
          </label>
          <div className="relative w-full">
            <input
              dir="ltr"
              disabled={isSentCode}
              {...register("phone")}
              type="text"
              placeholder="09123456789"
              className={cn(
                "input input-bordered w-full ps-10",
                errors.phone?.message ? "input-error" : "input"
              )}
            />
            <div className="absolute left-4 top-0 bottom-0 flex items-center">
              <span className="translate-y-px">🇮🇷</span>
            </div>
          </div>
          <ErrorMessage
            errors={errors}
            name="phone"
            render={({ message }) => (
              <span className="text-error mt-2">{message}</span>
            )}
          />
        </div>
        {!isSentCode && (
          <div className="form-control mt-6">
            <button className="btn btn-primary" disabled={isLoading}>
              ارسال کد
            </button>
          </div>
        )}
      </form>
      {isSentCode && (
        <form name="verifyForm" onSubmit={verifyCodeHandler}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">کد تایید</span>
            </label>

            <OTPInput
              shouldAutoFocus={true}
              skipDefaultStyles
              inputType="number"
              renderSeparator="-"
              value={otp}
              onChange={setOtp}
              numInputs={5}
              renderInput={(props) => <input {...props} />}
              containerStyle={{
                display: "flex",
                justifyContent: "center",
                direction: "ltr",
              }}
              inputStyle={{
                height: "3rem",
                width: "3rem",
                textAlign: "center",
                fontSize: "1rem",
                lineHeight: "2",
                borderRadius: "0.5rem",
                borderWidth: "1px",
                borderColor: "oklch(0.746477 0.0216 264.436 / 0.2)",
                margin: "0px 4px",
                backgroundColor: "transparent",
              }}
            />
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                تایید کد
              </button>
            </div>
          </div>
        </form>
      )}
      <div className="flex justify-around gap-1 text-right mt-4">
        <Link className="btn w-fit" href="/auth/login-with-password">
          ورود با رمزعبور
        </Link>
        <Link className="btn w-fit" href="/guest">
          ورود به عنوان مهمان
        </Link>
      </div>
    </div>
  );
}
