export function convertToPersianTimeWithEnglishNumbers(date: Date) {
  if (!date) return "";

  // تبدیل زمان به فرمت فارسی
  const timeInPersian = date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // جایگزینی اعداد فارسی با اعداد انگلیسی
  const timeWithEnglishNumbers = timeInPersian.replace(/[۰-۹]/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) - 1728)
  );

  return timeWithEnglishNumbers;
}

export function timeStringToDate(timeString: string) {
  // ابتدا تاریخ امروز را دریافت می‌کنیم
  const today = new Date();

  // سپس ساعت و دقیقه را از رشته زمانی جدا می‌کنیم
  const [hours, minutes] = timeString.split(":").map(Number);

  // ساعت و دقیقه را برای شیء Date تنظیم می‌کنیم
  today.setHours(hours);
  today.setMinutes(minutes);
  today.setSeconds(0); // اگر ثانیه را صفر کنیم

  return today;
}
