import AvatarForm from "@/components/modules/edit-profile/AvatarForm";
import EmailForm from "@/components/modules/edit-profile/EmailForm";
import InfoForm from "@/components/modules/edit-profile/InfoForm";
import PasswordForm from "@/components/modules/edit-profile/PasswordForm";
import PhoneForm from "@/components/modules/edit-profile/PhoneForm";
import { IUser } from "@/types";
import { isAuth } from "@/utils/serverHelpers";

export default async function EditProfilePage() {
  // constants
  const user = await isAuth();

  return (
    <section>
      <div className="space-y-2">
        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-lg font-medium">
            ویرایش / اضافه کردن عکس پروفایل
          </summary>
          <div className="collapse-content">
            <AvatarForm user={user as IUser} />
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
          <summary className="collapse-title text-lg font-medium">
            ویرایش رمزعبور
          </summary>
          <div className="collapse-content">
            <PasswordForm />
          </div>
        </details>

        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-lg font-medium">
            ویرایش اطلاعات
          </summary>
          <div className="collapse-content">
            <InfoForm user={user as IUser} />
          </div>
        </details>
      </div>
    </section>
  );
}
