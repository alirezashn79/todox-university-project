"use client";
import { ErrorMessage } from "@hookform/error-message";
import { cn } from "cn-func";

interface IInput {
  label: string;
  disabled?: boolean;
  register: React.InputHTMLAttributes<HTMLInputElement>;
  dir?: "ltr" | "rtl";
  type?: "text" | "password" | "email";
  errors: any;
  name: string;
  placeholder: string;
  required?: boolean;
}

export default function Input({
  errors,
  label,
  name,
  placeholder,
  register,
  dir = "rtl",
  disabled,
  required = true,
  type = "text",
}: IInput) {
  return (
    <div className="form-control">
      <label className="label">
        <span
          className={cn(
            "label-text",
            errors[name]?.message ? "text-error" : ""
          )}
        >
          {label}
          {required && <i className="ms-1 text-error font-bold">*</i>}
        </span>
      </label>
      <div className="relative w-full">
        <input
          dir={dir}
          disabled={disabled}
          {...register}
          type={type}
          placeholder={placeholder}
          className={cn(
            "input input-bordered w-full",
            errors[name]?.message ? "input-error" : "input",
            name === "phone" ? "ps-10" : ""
          )}
        />
        {name === "phone" && (
          <div className="absolute left-4 top-0 bottom-0 flex items-center">
            <span className="translate-y-px">🇮🇷</span>
          </div>
        )}
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <span className="text-error mt-2">{message}</span>
        )}
      />
    </div>
  );
}
