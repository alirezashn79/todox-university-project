"use client";

import Link from "next/link";

export default function DropDown() {
  const handleClick = () => {
    const elem: any = document.activeElement;
    if (elem) {
      elem?.blur();
    }
  };
  return (
    <li className="font-semibold" onClick={handleClick}>
      <Link className="px-2 py-3" href="/used-packages">
        پکیج های استفاده شده
      </Link>
    </li>
  );
}
