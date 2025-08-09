export function compact<T extends object>(obj: T): Partial<T> {
  const result = {} as Partial<T>

  Object.keys(obj).forEach((key) => {
    const typedKey = key as keyof T
    const value = obj[typedKey]

    if (value !== null && value !== undefined && value !== '' && value !== 0) {
      result[typedKey] = value
    }
  })

  return result
}
