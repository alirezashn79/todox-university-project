import { PulseLoader } from "react-spinners";

export default function Button({
  loading,
  text,
  type,
}: {
  loading: boolean;
  text: string;
  type: "button" | "submit";
}) {
  return (
    <button type={type} className="btn btn-primary" disabled={loading}>
      {loading ? <PulseLoader color="#7480ff" size={6} /> : <span>{text}</span>}
    </button>
  );
}
