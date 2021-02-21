import isWeekend from '../isWeekend/index'
import toDate from '../toDate/index'
import toInteger from '../_lib/toInteger/index'
import requiredArgs from '../_lib/requiredArgs/index'
import isSunday from '../isSunday/index'
import isSaturday from '../isSaturday/index'
import isBefore from '../isBefore/index'
import addDays from '../addDays/index'
import isAfter from '../isAfter/index'
import subDays from '../subDays/index'

/**
 * @name addBusinessDays
 * @category Day Helpers
 * @summary Add the specified number of business days (mon - fri) to the given date.
 *
 * @description
 * Add the specified number of business days (mon - fri) to the given date, ignoring weekends.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of business days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the business days added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 10 business days to 1 September 2014:
 * const result = addBusinessDays(new Date(2014, 8, 1), 10)
 * //=> Mon Sep 15 2014 00:00:00 (skipped weekend days)
 */
export default function addBusinessDays(
  dirtyDate: Date | number,
  dirtyAmount: number,
  businessDays = [1, 2, 3, 4, 5]
): Date {
  requiredArgs(2, arguments)

  const date = toDate(dirtyDate)
  const amount = toInteger(dirtyAmount)

  if (isNaN(amount)) return new Date(NaN)

  const hours = date.getHours()

  // const threshold =  amount < 0 ? subDays(date, Math.abs(amount) - 1) : addDays(date, amount - 1)

  const isBeforeOrAfter = (date: Date) =>
    amount < 0
      ? isBefore(date, subDays(date, Math.abs(amount) - 1))
      : isAfter(date, addDays(date, amount - 1))

  const result = Array.from(Array(Math.abs(amount))).reduce<Date>(
    (acc, current) => {
      if (isBeforeOrAfter(acc) && businessDays.includes(acc.getDay())) {
        return acc
      }

      let tmp = amount < 0 ? subDays(acc, 1) : addDays(acc, 1)
      const calc = () => {
        if (!businessDays.includes(tmp.getDay())) {
          tmp = amount < 0 ? subDays(tmp, 1) : addDays(tmp, 1)
          calc()
        }
        return
      }
      calc()

      return tmp
    },
    date
  )

  // Restore hours to avoid DST lag
  result.setHours(hours)

  return result
}
