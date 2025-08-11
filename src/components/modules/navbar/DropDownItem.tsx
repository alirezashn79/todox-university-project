'use client'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DropDownItem() {
  const path = usePathname()

  const handleClick = () => {
    const elem: any = document.activeElement
    if (elem) {
      elem?.blur()
    }
  }

  const items = [
    {
      title: 'خانه',
      url: '/',
    },
    {
      title: 'ویرایش پروفایل',
      url: '/edit-profile',
    },
    {
      title: 'چت با Ai',
      url: '/ai-assistant',
    },
  ]

  const isActive = (url: string) => {
    return path === url
  }
  return (
    <>
      {items.map((item, index) => (
        <li
          key={index}
          className={cn('font-semibold', isActive(item.url) && 'font-bold text-primary')}
          onClick={handleClick}
        >
          <Link className="px-2 py-3" href={item.url}>
            {item.title}
          </Link>
        </li>
      ))}
    </>
  )
}
