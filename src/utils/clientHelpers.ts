export function convertToPersianTimeWithEnglishNumbers(date: Date) {
  if (!date) return ''

  const timeInPersian = date.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const timeWithEnglishNumbers = timeInPersian.replace(/[۰-۹]/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) - 1728)
  )

  return timeWithEnglishNumbers
}

export function convertPersianDateToEnglishNumbers(date: Date) {
  if (!date) return ''

  const persianDate = date.toLocaleDateString('fa-IR')

  const dateWithEnglishNumbers = persianDate.replace(/[۰-۹]/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) - 1728)
  )

  const formattedDate = dateWithEnglishNumbers.replace(/\//g, '-')

  return formattedDate
}

export function timeStringToDate(timeString: string) {
  const today = new Date()

  const [hours, minutes] = timeString.split(':').map(Number)

  today.setHours(hours)
  today.setMinutes(minutes)
  today.setSeconds(0)

  return today
}

export function percentage(total: number, checked: number = 0) {
  if (!total) {
    return 0
  }
  let percent = Math.round((checked * 100) / total)
  return percent
}
