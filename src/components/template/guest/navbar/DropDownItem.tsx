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
  if (path === '/guest/edit-profile') {
    return (
      <li className="font-semibold" onClick={handleClick}>
        <Link className="px-2 py-3" href="/guest">
          خانه
        </Link>
      </li>
    )
  }
  if (path === '/guest') {
    return (
      <li className="font-semibold" onClick={handleClick}>
        <Link className="px-2 py-3" href="/guest/edit-profile">
          ویرایش پروفایل
          <span className="text-[10px] text-warning">صرفا برای دیدن</span>
        </Link>
      </li>
    )
  }
}
