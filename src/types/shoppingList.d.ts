export interface IShoppingItem {
  _id: string // شناسهٔ مونگو
  user: string // شناسهٔ کاربری که این آیتم را ساخته
  date: string // تاریخ به فرمت YYYY-MM-DD (به صورت رشته‌ی انگلیسی)
  name: string // نام آیتم
  quantity?: number // تعداد (اختیاری)
  isPurchased: boolean // آیا خرید شده؟
  price?: number // قیمت (اختیاری)
  reason?: string // توضیح/دلیل خرید (اختیاری)
  group?: // اگر در یک گروه باشد:
  | string // — فقط شناسه گروه
    | {
        // — یا شیء گروه در صورت populate
        _id: string
        name: string
      }
  createdAt?: string // در صورت برگشت‌دادن توسط سرور (اختیاری)
  updatedAt?: string // در صورت برگشت‌دادن توسط سرور (اختیاری)
}
