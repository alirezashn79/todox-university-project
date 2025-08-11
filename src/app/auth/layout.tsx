import Animation from '@/components/template/auth/Animation'
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
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-center text-4xl font-bold text-primary lg:text-5xl">تودو پلنر</h1>
            <p className="mt-2 text-xs text-base-content">ابزار مدیریت کارهای روزانه + چت با Ai</p>
            <Animation />
          </div>
          {children}
        </div>
      </div>

      <ThemeToggle />
    </div>
  )
}
