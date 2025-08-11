'use client'
import Button from '@/components/modules/Button'
import Input from '@/components/modules/input'
import { zSignInForm } from '@/schemas/schema'
import client from '@/utils/client'
import { FireToast } from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TypeOf } from 'zod'

type TLoginWithPassForm = TypeOf<typeof zSignInForm>

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginWithPassForm>({
    resolver: zodResolver(zSignInForm),
  })
  const { replace } = useRouter()

  const handleLogin: SubmitHandler<TLoginWithPassForm> = async (values) => {
    try {
      await client.post('api/auth/login', {
        identifier: values.identifier.trim().toLowerCase(),
        password: values.password.trim(),
      })
      FireToast({ type: 'success', message: 'تایید شد' })
      replace('/')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="card-body">
      <form onSubmit={handleSubmit(handleLogin)}>
        <Input
          name="identifier"
          register={register('identifier')}
          label="شماره موبایل یا ایمیل یا نام کاربری"
          errors={errors}
          placeholder="شماره یا ایمیل یا نام کاربری را وارد کن"
          dir="ltr"
        />

        <Input
          name="password"
          register={register('password')}
          label="رمز عبور"
          errors={errors}
          placeholder="رمزتو وارد کن"
          dir="ltr"
          type="password"
        />

        <div className="form-control mt-6">
          <Button loading={isSubmitting} type="submit" text="ورود" />
        </div>
      </form>

      <div className="mt-4 flex flex-wrap justify-around gap-1.5 text-right">
        <Link className="btn w-fit" href="/auth/login-register">
          ثبت نام | ورود با کد یکبار مصرف
        </Link>
      </div>
    </div>
  )
}
