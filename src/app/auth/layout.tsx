import ThemeToggle from '@/components/template/auth/themeToggle'
import { isAuth } from '@/utils/serverHelpers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  const user = await isAuth()

  if (user) {
    return redirect('/')
  }
  return (
    <div className="container">
      <div className="hero min-h-screen">
        <div className="hero-content flex flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-center text-5xl font-bold leading-[4rem]">
              به
              <span className="mx-2 inline-block animate-bounce text-primary">تودو ایکس</span>
              <br className="block lg:hidden" />
              خوش آمدید
            </h1>
          </div>
          {children}
        </div>
      </div>

      <div className="absolute end-0 start-0 top-0.5 flex justify-center">
        <Link className="btn btn-outline" href="/used-packages">
          پکیج های مهم پروژه
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
          </div>
        </Link>
      </div>

      <ThemeToggle />
    </div>
  )
}
