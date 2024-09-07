import AvatarForm from "@/components/modules/edit-profile/AvatarForm";
import InfoForm from "@/components/modules/edit-profile/InfoForm";
import PasswordForm from "@/components/modules/edit-profile/PasswordForm";
import { IUser } from "@/types";
import { isAuth } from "@/utils/serverHelpers";

export default async function EditProfilePage() {
  const user = await isAuth();

  return (
    <section>
      <div className="space-y-2">
        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-xl font-medium">
            ویرایش عکس پروفایل
          </summary>
          <div className="collapse-content">
            <AvatarForm user={user as IUser} />
          </div>
        </details>

        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-xl font-medium">
            ویرایش اطلاعات
          </summary>
          <div className="collapse-content">
            <InfoForm user={user as IUser} />
          </div>
        </details>
        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title text-xl font-medium">
            ویرایش رمزعبور
          </summary>
          <div className="collapse-content">
            <PasswordForm />
          </div>
        </details>
      </div>
    </section>
  );
}
