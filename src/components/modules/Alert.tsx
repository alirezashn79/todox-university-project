"use client";
import useAlertStore from "@/stores/AlertStore";
import { cn } from "cn-func";
interface IAlertProps {
  type: "error" | "info" | "warning" | "success";
  handleAccept: () => void;
  title: string;
  successText: string;
}
export default function Alert({
  type,
  title,
  successText,
  handleAccept,
}: IAlertProps) {
  const isOpen = useAlertStore((state) => state.isOpen);
  const toggleAlert = useAlertStore((state) => state.toggleAlert);
  const toastOpen = useAlertStore((state) => state.toastOpen);
  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-200",
        isOpen
          ? "bottom-0 md:top-0 md:bottom-auto"
          : "-bottom-44 md:bottom-auto md:-top-44"
      )}
    >
      <div role="alert" className="alert py-5 shadow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={cn(
            "h-6 w-6 shrink-0",
            type === "warning" && "stroke-warning",
            type === "info" && "stroke-info",
            type === "success" && "stroke-success"
          )}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>{title}</span>
        <div>
          <button className="btn btn-sm" onClick={() => toggleAlert(false)}>
            Deny
          </button>
          <button className="btn btn-sm btn-primary" onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
      {toastOpen && (
        <div className="toast toast-bottom md:toast-top toast-center">
          <div className="alert alert-success">
            <span>{successText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
