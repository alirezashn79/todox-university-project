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
    <div className="navbar sticky end-0 start-0 top-0 z-50 mb-2 border-b bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost font-morabba text-2xl font-bold">
          <span className="text-primary">تودو</span>
          پلنر
        </Link>
      </div>
      <Theme />
      <AddTodo />
      <Profile user={user} />
    </div>
  )
}
