'use client'
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
  if (path === '/edit-profile') {
    return (
      <li className="font-semibold" onClick={handleClick}>
        <Link className="px-2 py-3" href="/">
          خانه
        </Link>
      </li>
    )
  }
  if (path === '/') {
    return (
      <li className="font-semibold" onClick={handleClick}>
        <Link className="px-2 py-3" href="/edit-profile">
          ویرایش پروفایل
        </Link>
      </li>
    )
  }
}
