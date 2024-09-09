"use client";

import Button from "@/components/modules/Button";
import Input from "@/components/modules/input";
import { zPhoneSchema } from "@/schemas/schema";
import client from "@/utils/client";
import { FireToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Countdown from "react-countdown";
import { SubmitHandler, useForm } from "react-hook-form";
import OTPInput from "react-otp-input";
import { TypeOf } from "zod";

type TPhoneSchema = TypeOf<typeof zPhoneSchema>;

export default function Sms() {
  const [otp, setOtp] = useState("");
  const [isSentCode, setIsSentCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startCountDown, setStartCountDown] = useState(false);
  const [date, setDate] = useState<number | null>(null);

  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TPhoneSchema>({
    resolver: zodResolver(zPhoneSchema),
  });

  const sendCodeHandler: SubmitHandler<TPhoneSchema> = async (values) => {
    try {
      setIsLoading(true);
      const res = await client.post("api/auth/sms/send", values);
      const currentTimeClient = Date.now() + 120_000;
      const expirationTimeServer = res.data.expTime;
      const timeOffset = currentTimeClient - expirationTimeServer;
      const adjustedExpirationTime = expirationTimeServer + timeOffset;
      setDate(adjustedExpirationTime);
      sessionStorage.setItem("timeOffset", String(timeOffset));
      FireToast({ type: "success", message: "کد ارسال شد" });
      setIsSentCode(true);
      sessionStorage.setItem("phone", values.phone);
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 451) {
          if (!!sessionStorage.getItem("timeOffset")) {
            setDate(
              error.response.data.expTime +
                Number(sessionStorage.getItem("timeOffset"))
            );
            setIsSentCode(true);
            FireToast({ type: "error", message: "رمز قبلا ارسال شده است" });
          }
        }
        console.log(error);
      }
    } finally {
      setIsLoading(false);
      setStartCountDown(true);
    }
  };

  const verifyCodeHandler = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    try {
      setIsLoading(true);
      const phone = sessionStorage.getItem("phone");
      const res = await client.post("api/auth/sms/verify", {
        phone,
        code: otp,
      });
      FireToast({ type: "success", message: "تایید شد" });
      sessionStorage.removeItem("phone");
      sessionStorage.removeItem("timeOffset");
      if (res.status === 200) {
        replace("/");
      } else if (res.status === 202) {
        replace("/complete-profile");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-body">
      <form onSubmit={handleSubmit(sendCodeHandler)}>
        <Input
          name="phone"
          register={register("phone")}
          disabled={isLoading || isSentCode}
          label="شماره موبایل"
          errors={errors}
          placeholder="09123456789"
          dir="ltr"
        />

        {!isSentCode && (
          <div className="form-control mt-6">
            <Button loading={isLoading} type="submit" text="ارسال کد" />
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
              <div className="flex items-center justify-center gap-x-4 my-2">
                <button
                  disabled={startCountDown}
                  className="btn btn-link btn-ghost w-fit"
                  type="button"
                  onClick={async () => {
                    setStartCountDown(true);
                    sendCodeHandler({
                      phone: sessionStorage.getItem("phone") as string,
                    });
                  }}
                >
                  ارسال مجدد رمز
                </button>
                {startCountDown ? (
                  <Countdown
                    onComplete={() => setStartCountDown(false)}
                    renderer={({ minutes, seconds }) => (
                      <span className="countdown text-lg  font-semibold">
                        <span style={{ "--value": seconds } as any}></span>
                        {"  :  "}
                        <span style={{ "--value": minutes } as any}></span>
                      </span>
                    )}
                    date={date || Date.now()}
                  />
                ) : (
                  <>
                    <span className="countdown text-lg">
                      <span style={{ "--value": 0 } as any}></span>:
                      <span style={{ "--value": 0 } as any}></span>
                    </span>
                  </>
                )}
              </div>
              <Button
                disabled={otp.length < 5}
                loading={isLoading}
                type="submit"
                text="تایید کد"
              />
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
