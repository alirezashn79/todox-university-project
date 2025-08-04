'use client'

import { zClientImageSchema } from '@/schemas/schema'
import { IUser } from '@/types'
import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/utils/cn'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import Button from '../Button'
import client from '@/utils/client'
import { FireToast } from '@/utils/toast'
import { useRouter } from 'next/navigation'

type TAvatar = TypeOf<typeof zClientImageSchema>

export default function AvatarForm({ user }: { user: IUser }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { refresh } = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TAvatar>({
    resolver: zodResolver(zClientImageSchema),
  })

  const handleChangeAvatar: SubmitHandler<TAvatar> = async (values) => {
    try {
      const formData = new FormData()
      formData.append('avatar', values.avatar[0])
      await client.put('api/user/edit-profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      reset()
      refresh()
      FireToast({
        type: 'success',
        message: 'عکس پروفایل با موفقیت تغییر کرد',
      })
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }
  return (
    <form onSubmit={handleSubmit(handleChangeAvatar)}>
      <div className="flex flex-col items-center gap-8">
        <p className="text-xs text-warning">برای انتخاب عکس روی عکس کلیک کنید.</p>
        <label className="label flex cursor-pointer items-center justify-center">
          <input
            type="file"
            className="hidden"
            {...register('avatar')}
            onChange={async (e) => {
              await register('avatar').onChange(e)
              handleAvatar(e)
            }}
          />
          {watch('avatar') ? (
            <div className="avatar">
              <div
                className={cn(
                  'w-40 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 lg:w-64',
                  errors.avatar?.message ? 'border-4 border-error' : ''
                )}
              >
                <img src={imagePreview as string} />
              </div>
            </div>
          ) : (
            <div className="avatar">
              <div className="w-40 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 lg:w-64">
                {user.avatar ? <img src={user?.avatar} /> : <img src="/img/user-no-avatar.png" />}
              </div>
            </div>
          )}
        </label>
        <ErrorMessage
          errors={errors}
          name="avatar"
          render={({ message }) => <span className="mt-2 text-error">{message}</span>}
        />
        <div className="flex items-center gap-4">
          <Button text="تغییر عکس" loading={isSubmitting} disabled={!watch('avatar')} />
          {watch('avatar') && !isSubmitting && (
            <Button
              type="button"
              loading={false}
              text="لغو"
              disabled={!watch('avatar')}
              className="btn-outline btn-error"
              onClick={reset}
            />
          )}
        </div>
      </div>
    </form>
  )
}
