import { cn } from "cn-func";
import { PulseLoader } from "react-spinners";

export default function Button({
  loading,
  text,
  type = "submit",
  disabled,
  className = "",
}: {
  loading: boolean;
  text: string;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      className={cn("btn btn-primary", className)}
      disabled={loading || disabled}
    >
      {loading ? <PulseLoader color="#7480ff" size={6} /> : <span>{text}</span>}
    </button>
  );
}
