import { IUser } from '@/types'
import Link from 'next/link'
import AddTodo from '../template/index/AddTodo'
import Profile from './navbar/Profile'
import Theme from './Theme'
interface INavbarProps {
  user: IUser
}
export default async function Navbar({ user }: INavbarProps) {
  return (
    <div className="navbar sticky end-0 start-0 top-0 z-50 mb-6 border-b bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-2xl">
          <span className="animate-pulse text-primary">X</span>
          Todo
        </Link>
      </div>
      <Theme />
      <AddTodo />
      <Profile user={user} />
    </div>
  )
}
