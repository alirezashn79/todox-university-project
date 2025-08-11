'use client'
import Link from 'next/link'

export default function notFound() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-9xl font-extrabold tracking-widest">404</h1>
      <div className="absolute rotate-12 rounded bg-primary px-2 text-sm text-white">
        Page Not Found
      </div>
      <button className="mt-5">
        <Link
          href="/"
          className="group relative inline-block text-sm font-medium text-primary focus:outline-none focus:ring active:text-primary"
        >
          <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-primary transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

          <span className="relative block border border-current bg-primary px-8 py-3 text-white">
            بازگشت به صفحه اصلی
          </span>
        </Link>
      </button>
    </main>
  )
}
