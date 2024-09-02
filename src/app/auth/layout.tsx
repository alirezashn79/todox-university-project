import { isAuth } from "@/utils/serverHelpers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = await isAuth();

  if (user) {
    return redirect("/");
  }
  return (
    <div className="container">
      <div className="hero min-h-screen">
        <div className="hero-content flex lg:flex-row flex-col">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl text-center leading-[4rem] font-bold">
              به
              <span className="inline-block text-primary animate-bounce mx-2">
                تودو ایکس
              </span>
              <br className="block lg:hidden" />
              خوش آمدید
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
