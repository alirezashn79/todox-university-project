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

export function convertPersianDateToEnglishNumbers(date: Date) {
  if (!date) return "";

  // تبدیل تاریخ به فرمت فارسی
  const persianDate = date.toLocaleDateString("fa-IR");

  // جایگزینی اعداد فارسی با اعداد انگلیسی
  const dateWithEnglishNumbers = persianDate.replace(/[۰-۹]/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) - 1728)
  );

  // جایگزینی '/' با '-'
  const formattedDate = dateWithEnglishNumbers.replace(/\//g, "-");

  return formattedDate;
}

export function timeStringToDate(timeString: string) {
  const today = new Date();

  const [hours, minutes] = timeString.split(":").map(Number);

  today.setHours(hours);
  today.setMinutes(minutes);
  today.setSeconds(0);

  return today;
}
