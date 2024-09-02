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
}

export default function Input(props: IInput) {
  return (
    <div className="form-control">
      <label className="label">
        <span
          className={cn(
            "label-text",
            props.errors[props.name]?.message ? "text-error" : ""
          )}
        >
          {props.label}
        </span>
      </label>
      <div className="relative w-full">
        <input
          dir={props.dir || "rtl"}
          disabled={props.disabled}
          {...props.register}
          type={props.type || "text"}
          placeholder={props.placeholder}
          className={cn(
            "input input-bordered w-full",
            props.errors[props.name]?.message ? "input-error" : "input",
            props.name === "phone" ? "ps-10" : ""
          )}
        />
        {props.name === "phone" && (
          <div className="absolute left-4 top-0 bottom-0 flex items-center">
            <span className="translate-y-px">🇮🇷</span>
          </div>
        )}
      </div>
      <ErrorMessage
        errors={props.errors}
        name={props.name}
        render={({ message }) => (
          <span className="text-error mt-2">{message}</span>
        )}
      />
    </div>
  );
}
