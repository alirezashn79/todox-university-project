import Row from '@/components/template/used-packages/Row'

export default function UsedPackagesPage() {
  return (
    <div className="container pt-10">
      <h1 className="text-center text-3xl">پکیج های مهم استفاده شده در پروژه</h1>

      <div className="my-8">
        <div className="mockup-code space-y-2">
          <Row packageName="next">هسته اصلی پروژه (ورژن 14)</Row>
          <Row packageName="typescript">تایپ اسکریپت برای به صفر رساندن خطاهای پروژه</Row>
          <Row packageName="mongoose">برای کار با دیتابیس MongoDB</Row>
          <Row packageName="daisyui">کامپوننت لایبرری از Tailwindcss برای Ui</Row>
          <Row packageName="zustand">
            برای مدیریت استیت های کلاینت (استفاده از قابلیت persist برای ذخیره و آپدیت خودکار داده
            ها در localeStorage )
          </Row>
          <Row packageName="swr">
            برای مدیریت و کش state های سرور ( جلوگیری از ریکوئست های تکراری به سرور )
          </Row>
          <Row packageName="nodemailer @types/nodemailer">برای ارسال کد تایید از طریق ایمیل</Row>
          <Row packageName="react-hook-form">برای مدیریت فرم های کلاینت</Row>
          <Row packageName="zod">
            برای validation کردن فرم ها و همچنین validation کردن داده ها در سمت سرور ( api ها )
          </Row>

          <Row packageName="aws-sdk">برای ذخیره عکس پروفایل در فضای ذخیره سازی ابری</Row>
          <Row packageName="jsonwebtoken @types/jsonwebtoken">
            برای Generate و Verify کردن توکن های JWT (Access Token و Refresh Token)
          </Row>
          <Row packageName="react-jwt">برای چک کردن Expire شدن توکن های Access و Refresh</Row>
          <Row packageName="bcryptjs @types/bcryptjs">برای Hash کردن Password کاربر</Row>
          <Row packageName="framer-motion">برای Transition عوض شدن صفحه</Row>
          <Row packageName="react-multi-date-picker">تقویم استفاده شده در پروژه</Row>

          <Row packageName="axios">برای رکوئست ها</Row>

          <Row packageName="react-swipeable">
            برای استفاده از قابلیت عوض کردن روزهای تقویم با Swap کردن
          </Row>
          <Row packageName="react-otp-input">
            برای هندل و نمایش بهتر Input های کد تایید ارسالی از طریق SMS
          </Row>
          <Row packageName="react-countdown">
            برای هندل کردن شمارش معکوس برای ارسال مجدد کد تایید برای SMS
          </Row>
          <Row packageName="react-hot-toast">Alert های جذاب در پروژه</Row>
          <Row packageName="sweetalert2">Alert برای Confirm کردن برخی درخواست های کاربر در Ui</Row>
          <Row packageName="react-spinners">Loading های جذاب پروژه</Row>
        </div>
      </div>
    </div>
  )
}
