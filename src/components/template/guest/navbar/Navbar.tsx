import Theme from '@/components/modules/Theme'
import Link from 'next/link'
import AddTodo from './AddTodo'
import Profile from './Profile'

export default function Navbar() {
  return (
    <div className="navbar sticky end-0 start-0 top-0 z-50 border-b bg-base-100">
      <div className="flex-1">
        <Link href="/guest" className="btn btn-ghost text-2xl">
          <span className="animate-pulse text-primary">X</span>
          Todo
        </Link>
      </div>
      <Theme />
      <AddTodo />
      <Profile />
    </div>
  )
}
