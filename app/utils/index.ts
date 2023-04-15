import { format } from 'date-fns-tz'

export const convertToBool = (arg: any): boolean => {
  if (typeof arg != 'string') {
    return Boolean(arg)
  }
  try {
    return JSON.parse(arg.toLowerCase()) === true
  } catch (e) {
    return arg != ''
  }
}

// format date to ISO 8601
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd\'T\'HH:mm:ssxxx', { timeZone: 'Asia/Tokyo' })
}
