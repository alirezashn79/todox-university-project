import AvatarForm from '@/components/modules/edit-profile/AvatarForm'
import EmailForm from '@/components/modules/edit-profile/EmailForm'
import InfoForm from '@/components/modules/edit-profile/InfoForm'
import PasswordForm from '@/components/modules/edit-profile/PasswordForm'
import PhoneForm from '@/components/modules/edit-profile/PhoneForm'

export default async function EditProfilePage() {
  const user = {
    _id: 'as',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAbxLFQV-czLC8EIyE7-XELkRxB7NuHx9XxQ&s',
    fullName: 'کاربر مهمان',
    phone: '09999999999',
    username: 'guest_test',
  }
  return (
    <section className="mt-4">
      <div className="space-y-2">
        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-lg font-medium">
            ویرایش / اضافه کردن عکس پروفایل
          </summary>
          <div className="collapse-content">
            <AvatarForm user={user} />
          </div>
        </details>

        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-lg font-medium">
            ویرایش / اضافه کردن ایمیل
          </summary>
          <div className="collapse-content">
            <EmailForm />
          </div>
        </details>

        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-lg font-medium">
            ویرایش / اضافه کردن شماره موبایل
          </summary>
          <div className="collapse-content">
            <PhoneForm />
          </div>
        </details>

        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-lg font-medium">ویرایش رمزعبور</summary>
          <div className="collapse-content">
            <PasswordForm />
          </div>
        </details>

        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-lg font-medium">ویرایش اطلاعات</summary>
          <div className="collapse-content">
            <InfoForm user={user} />
          </div>
        </details>
      </div>
    </section>
  )
}
