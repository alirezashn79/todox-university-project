'use client'
import EmailForm from '@/components/template/auth/login-register/EmailForm'
import SmsForm from '@/components/template/auth/login-register/SmsForm'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'

export default function LoginRegisterPage() {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('email')
  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveTab('email'),
    onSwipedRight: () => setActiveTab('phone'),
    trackMouse: true,
  })
  return (
    <div className="card w-full max-w-sm shrink-0 border bg-base-100 shadow-2xl">
      <h1 className="card-title mt-8 block text-center">ثبت نام | ورود با کد یکبار مصرف</h1>
      <div className="container mt-6">
        <div {...handlers} role="tablist" className="tabs-boxed tabs flex items-center">
          <button
            onClick={() => setActiveTab('email')}
            role="tab"
            className={cn('tab basis-1/2', activeTab === 'email' && 'tab-active')}
          >
            ایمیل
          </button>
          <button
            onClick={() => setActiveTab('phone')}
            role="tab"
            className={cn('tab basis-1/2', activeTab === 'phone' && 'tab-active')}
          >
            شماره موبایل
          </button>
        </div>
      </div>
      <div className="card-body">
        {activeTab === 'email' ? <EmailForm /> : <SmsForm />}

        <div className="mt-4 flex justify-around gap-1 text-right">
          <Link className="btn w-fit" href="/auth/login-with-password">
            ورود با رمزعبور
          </Link>
          <Link className="btn w-fit" href="/guest">
            ورود به عنوان مهمان
          </Link>
        </div>
      </div>
    </div>
  )
}
