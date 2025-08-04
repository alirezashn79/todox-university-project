import Form from '@/components/template/complete-profile/Form'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function page() {
  const cookieStore = cookies()
  const temporaryToken = cookieStore.get('temporaryToken')
  if (!temporaryToken) {
    return redirect('/auth/login-register')
  }
  const token = cookieStore.get('token')

  if (!!token) {
    return redirect('/')
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center overflow-auto">
      <div className="card w-full max-w-sm shrink-0 border bg-base-100 shadow-2xl">
        <h1 className="card-title mt-8 block text-center">تکمیل پروفایل</h1>
        <Form />
      </div>
    </div>
  )
}
