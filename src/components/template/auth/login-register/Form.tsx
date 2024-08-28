"use client";

import { zPhoneSchema } from "@/schemas/schema";
import useTheme from "@/stores/ThemeStore";
import client from "@/utils/client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn-func";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import OTPInput from "react-otp-input";
import { TypeOf } from "zod";

type TPhoneSchema = TypeOf<typeof zPhoneSchema>;

export default function LoginForm() {
  const [otp, setOtp] = useState("");
  const [isSentCode, setIsSentCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme((state) => state.theme);

  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TPhoneSchema>({
    resolver: zodResolver(zPhoneSchema),
  });

  const sendCodeHandler: SubmitHandler<TPhoneSchema> = async (values) => {
    const loading = toast.loading("wating...", {
      style: {
        backgroundColor: theme === "dark" ? "#1d232a" : undefined,
        color: theme === "dark" ? "#a6adbb" : undefined,
        border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
      },
    });
    try {
      setIsLoading(true);
      const res = await client.post("/api/auth/sms/send", values);
      toast.success(res.data.message, {
        style: {
          backgroundColor: theme === "dark" ? "#1d232a" : undefined,
          color: theme === "dark" ? "#a6adbb" : undefined,
          border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
        },
      });
      setIsSentCode(true);
      sessionStorage.setItem("phone", values.phone);
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 451) {
          setIsSentCode(true);
        }
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
      setIsLoading(false);
    }
  };

  const verifyCodeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loading = toast.loading("wating...", {
      style: {
        backgroundColor: theme === "dark" ? "#1d232a" : undefined,
        color: theme === "dark" ? "#a6adbb" : undefined,
        border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
      },
    });

    try {
      setIsLoading(true);
      const phone = sessionStorage.getItem("phone");
      const res = await client.post("/api/auth/sms/verify", {
        phone,
        code: otp,
      });
      toast.success(res.data.message, {
        style: {
          backgroundColor: theme === "dark" ? "#1d232a" : undefined,
          color: theme === "dark" ? "#a6adbb" : undefined,
          border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
        },
      });
      sessionStorage.removeItem("phone");
      if (res.status === 200) {
        replace("/");
      } else if (res.status === 202) {
        replace("/auth/complete-profile");
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message, {
          style: {
            backgroundColor: theme === "dark" ? "#1d232a" : undefined,
            color: theme === "dark" ? "#a6adbb" : undefined,
            border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
          },
        });
      }
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
            <span className="label-text">Phone Number</span>
          </label>
          <div className="relative w-full">
            <input
              disabled={isSentCode}
              {...register("phone")}
              type="text"
              placeholder="09123456789"
              className={cn(
                "input input-bordered w-full pl-10",
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
              Send Code
            </button>
          </div>
        )}
      </form>

      {isSentCode && (
        <form onSubmit={verifyCodeHandler}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Code</span>
            </label>

            <OTPInput
              shouldAutoFocus={true}
              skipDefaultStyles
              value={otp}
              onChange={setOtp}
              numInputs={5}
              renderInput={(props) => <input {...props} />}
              containerStyle={{
                display: "flex",
                justifyContent: "center",
              }}
              inputStyle={{
                height: "3rem",
                // padding: "0px 1.3rem",
                width: "3rem",
                textAlign: "center",
                fontSize: "1rem",
                lineHeight: "2",
                borderRadius: "0.5rem",
                borderWidth: "1px",
                borderColor: "oklch(0.746477 0.0216 264.436 / 0.2)",
                margin: "0px 4px",
              }}
            />
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                verify Code
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
