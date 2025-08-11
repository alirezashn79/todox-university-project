import Navbar from '@/components/modules/navbar'
import { IUser } from '@/types'
import { isAuth } from '@/utils/serverHelpers'

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  // constants
  const user = await isAuth()
  return (
    <div className="container h-screen overflow-hidden">
      <Navbar user={user as IUser} />
      <main className="h-full overflow-y-auto pt-20">{children}</main>
    </div>
  )
}
