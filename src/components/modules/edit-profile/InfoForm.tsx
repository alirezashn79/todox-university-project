'use client'
import { zEditInfoSchema } from '@/schemas/schema'
import { IUser } from '@/types'
import client from '@/utils/client'
import { FireToast } from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import Button from '../Button'
import Input from '../input'
interface IInfoProps {
  user: IUser
}

const zInfoSchema = zEditInfoSchema
type TInfo = TypeOf<typeof zInfoSchema>
export default function InfoForm({ user }: IInfoProps) {
  const { refresh } = useRouter()
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TInfo>({
    defaultValues: {
      fullName: user.fullName,
      username: user.username,
    },
    resolver: zodResolver(zInfoSchema),
  })

  const onSubmit: SubmitHandler<TInfo> = async (values) => {
    try {
      const body = {
        fullName: Object.is(values.fullName, user.fullName) ? undefined : values.fullName,
        username: Object.is(values.username, user.username) ? undefined : values.username,
      }

      await client.put('api/user/edit-profile/info', body)
      refresh()
      FireToast({
        type: 'success',
        message: 'اطلاعات با موفقیت تغییر کرد',
      })
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 409) {
          setError('username', {
            message: 'نام کاربری وجود دارد',
          })
        }
        console.log(error)
      }
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          required={false}
          errors={errors}
          label="نام"
          name="fullName"
          register={register('fullName')}
          placeholder="نام را وارد کن"
        />

        <Input
          required={false}
          dir="ltr"
          errors={errors}
          label="نام کاربری"
          name="username"
          register={register('username')}
          placeholder="نام کاربری را وارد کن"
        />

        <Button
          loading={isSubmitting}
          disabled={
            (watch('fullName') === user.fullName && watch('username') === user.username) ||
            !watch('fullName') ||
            !watch('username')
          }
          text="ثبت"
        />
      </div>
    </form>
  )
}
