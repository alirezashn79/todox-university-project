'use client'
import { IUser } from '@/types'
import Link from 'next/link'
import Profile from './navbar/Profile'
import Theme from './Theme'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
interface INavbarProps {
  user: IUser
}
export default function Navbar({ user }: INavbarProps) {
  const pathname = usePathname()
  return (
    <header className="navbar sticky end-0 start-0 top-0 z-[50] mb-2 border-b bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost font-morabba text-2xl font-bold">
          <span className="text-primary">تودو</span>
          پلنر
        </Link>
      </div>
      <div className="flex h-full items-center gap-4">
        <Link href="/" className={cn('text-xs', pathname === '/' && 'font-bold text-primary')}>
          خانه
        </Link>
        <Link
          href="/ai-assistant"
          className={cn('text-xs', pathname === '/ai-assistant' && 'font-bold text-primary')}
        >
          دستیار هوش مصنوعی
        </Link>
      </div>
      <Theme />
      <Profile user={user} />
    </header>
  )
}
