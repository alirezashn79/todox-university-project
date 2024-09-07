"use client";

import Button from "@/components/modules/Button";
import Input from "@/components/modules/input";
import { zPhoneSchema } from "@/schemas/schema";
import client from "@/utils/client";
import { FireToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Countdown from "react-countdown";
import { SubmitHandler, useForm } from "react-hook-form";
import OTPInput from "react-otp-input";
import { TypeOf } from "zod";

type TPhoneSchema = TypeOf<typeof zPhoneSchema>;

export default function PhoneForm() {
  const [otp, setOtp] = useState("");
  const [isSentCode, setIsSentCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startCountDown, setStartCountDown] = useState(false);
  const [date, setDate] = useState<number | null>(null);

  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<TPhoneSchema>({
    resolver: zodResolver(zPhoneSchema),
  });

  const sendCodeHandler: SubmitHandler<TPhoneSchema> = async (values) => {
    try {
      setIsLoading(true);
      const res = await client.post("api/user/edit-profile/phone/send", values);
      setDate(res.data.expTime - 1_000);
      FireToast({ type: "success", message: "کد ارسال شد" });
      setIsSentCode(true);
      sessionStorage.setItem("phone", values.phone);
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 409) {
          setError("phone", {
            message: "شماره وجود دارد",
          });
          setValue("phone", "");
        }
        if (error.response.status === 451) {
          setIsSentCode(true);
          FireToast({ type: "error", message: "رمز قبلا ارسال شده است" });
          setDate(error.response.data.expTime - 1_000);
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
      await client.post("api/user/edit-profile/phone/verify", {
        phone,
        code: otp,
      });
      sessionStorage.removeItem("phone");
      await client.get("api/auth/logout");
      replace("/auth/login-with-password");
      FireToast({ type: "success", message: "تایید شد، مجدد لاگین کنید" });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(sendCodeHandler)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            name="phone"
            register={register("phone")}
            label="شماره موبایل جدید"
            errors={errors}
            placeholder="09123456789"
            dir="ltr"
            disabled={isLoading}
          />

          {!isSentCode && (
            <div className="form-control">
              <Button
                className="sm:mt-9"
                loading={isLoading}
                type="submit"
                text="ارسال کد"
              />
            </div>
          )}
        </div>
      </form>
      {isSentCode && (
        <form name="verifyForm" onSubmit={verifyCodeHandler}>
          <div className="grid sm:grid-cols-2">
            <div className=" sm:col-start-2 sm:-translate-y-[90px] sm:ps-4">
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
              </div>
              <div className="form-control mt-6">
                <div className="flex items-center justify-center gap-x-4 my-2">
                  <button
                    disabled={startCountDown}
                    className="btn btn-link btn-ghost w-fit"
                    type="button"
                    onClick={async () => {
                      await sendCodeHandler({
                        phone: sessionStorage.getItem("phone") as string,
                      });
                      setStartCountDown(true);
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
          </div>
        </form>
      )}
    </>
  );
}
