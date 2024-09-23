import { formatInTimeZone, toDate } from 'date-fns-tz'
import { parse, isAfter, isSameDay as isSameDayBase, startOfDay } from 'date-fns'

const PST_TIMEZONE = 'America/Los_Angeles'

export const isPastMidnightPST = (date) => {
  const pstDate = toDate(date, { timeZone: PST_TIMEZONE })
  const midnightPST = parse(formatInTimeZone(pstDate, PST_TIMEZONE, 'yyyy-MM-dd 00:00:00'), 'yyyy-MM-dd HH:mm:ss', new Date())
  return isAfter(date, midnightPST)
}

export const isSameDay = (date1, date2) => {
  const pstDate1 = toDate(date1, { timeZone: PST_TIMEZONE })
  const pstDate2 = toDate(date2, { timeZone: PST_TIMEZONE })
  return isSameDayBase(pstDate1, pstDate2)
}

export const getCurrentDayPST = () => {
  return formatInTimeZone(new Date(), PST_TIMEZONE, 'yyyy-MM-dd')
}

export const getStartOfDayPST = (date) => {
  const pstDate = toDate(date, { timeZone: PST_TIMEZONE })
  return startOfDay(pstDate)
}