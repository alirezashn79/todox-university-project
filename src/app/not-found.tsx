"use client";
import Link from "next/link";

export default function notFound() {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-9xl font-extrabold  tracking-widest">404</h1>
      <div className="bg-primary px-2 text-sm rounded rotate-12 absolute text-white">
        Page Not Found
      </div>
      <button className="mt-5">
        <Link
          href="/"
          className="relative inline-block text-sm font-medium text-primary group active:text-primary focus:outline-none focus:ring"
        >
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-primary group-hover:translate-y-0 group-hover:translate-x-0"></span>

          <span className="relative block px-8 py-3 bg-primary text-white border border-current">
            بازگشت به صفحه اصلی
          </span>
        </Link>
      </button>
    </main>
  );
}
