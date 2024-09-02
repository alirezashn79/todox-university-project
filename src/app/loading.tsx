"use client";
import { PulseLoader } from "react-spinners";

export default function LoadingPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <PulseLoader color="#7480ff" size={18} margin={8} speedMultiplier={1.3} />
    </div>
  );
}
