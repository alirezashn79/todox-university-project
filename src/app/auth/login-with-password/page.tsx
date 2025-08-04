import Form from '@/components/template/auth/login-with-password/Form'
import Link from 'next/link'

export default function LoginWithPassword() {
  return (
    <div className="card w-full max-w-sm shrink-0 border bg-base-100 shadow-2xl">
      <h1 className="card-title mt-8 block text-center">ورود با رمز عبور</h1>
      <div className="ms-8 mt-4 flex items-center gap-2 text-xs leading-3 text-warning md:text-sm">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <p>
          اگه هنوز ثبت نام نکردی
          <Link href="/auth/login-register" className="btn btn-link px-1 text-warning">
            ثبت نام
          </Link>
          کن.
        </p>
      </div>
      <Form />
    </div>
  )
}
