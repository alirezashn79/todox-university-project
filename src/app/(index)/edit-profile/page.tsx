import AvatarForm from "@/components/modules/edit-profile/AvatarForm";
import { IUser } from "@/types";
import { isAuth } from "@/utils/serverHelpers";

export default async function EditProfilePage() {
  const user = await isAuth();

  return (
    <section>
      <AvatarForm user={user as IUser} />
    </section>
  );
}
