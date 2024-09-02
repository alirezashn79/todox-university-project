import Form from "@/components/template/complete-profile/Form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function page() {
  const cookieStore = cookies();
  const temporaryToken = cookieStore.get("temporaryToken");
  if (!temporaryToken) {
    return redirect("/auth/login-register");
  }
  const token = cookieStore.get("token");

  if (!!token) {
    return redirect("/");
  }

  return (
    <div className="h-screen w-full overflow-auto flex items-center justify-center flex-col">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl border">
        <h1 className="card-title text-center mt-8 block">تکمیل پروفایل</h1>
        <Form />
      </div>
    </div>
  );
}
