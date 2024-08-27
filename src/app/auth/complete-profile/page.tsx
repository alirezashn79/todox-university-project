import Form from "@/components/template/complete-profile/Form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function page() {
  const cookieStore = cookies();
  const temporaryToken = cookieStore.get("temporaryToken");
  if (!temporaryToken) {
    return redirect("/auth/login-register");
  }

  return (
    <div className="h-screen w-full overflow-auto flex items-center justify-center flex-col">
      <h1 className="text-4xl mb-4 font-bold">Complete Your Profile</h1>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl border">
        <Form />
      </div>
    </div>
  );
}
