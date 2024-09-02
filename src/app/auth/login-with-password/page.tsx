import Form from "@/components/template/auth/login-with-password/Form";

export default function LoginWithPassword() {
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl border">
      <h1 className="card-title text-center mt-8 block">ورود با رمز عبور</h1>
      <Form />
    </div>
  );
}
