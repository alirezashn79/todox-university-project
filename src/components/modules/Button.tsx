import { PulseLoader } from "react-spinners";

export default function Button({
  loading,
  text,
  type,
  disabled,
}: {
  loading: boolean;
  text: string;
  type: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      className="btn btn-primary"
      disabled={loading || disabled}
    >
      {loading ? <PulseLoader color="#7480ff" size={6} /> : <span>{text}</span>}
    </button>
  );
}
