import Navbar from "@/components/modules/navbar";
import { IUser } from "@/types";
import { isAuth } from "@/utils/serverHelpers";

export default async function IndexLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = await isAuth();
  return (
    <div className="container">
      <Navbar user={user as IUser} />
      {children}
    </div>
  );
}
