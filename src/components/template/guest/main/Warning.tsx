import Link from "next/link";

export default function Warning() {
  return (
    <div className="text-warning  leading-3 text-xs md:text-sm flex items-start gap-2 mt-2 sm:items-center">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <p>
        اینجا یک محیط همیشگی نیست و به منظور تست و آشنایی است! برای حفظ داده های
        خود
        <Link
          href="/auth/login-register"
          className=" btn px-1 text-warning btn-link"
        >
          ثبت نام
        </Link>
        کنید.
      </p>
    </div>
  );
}
