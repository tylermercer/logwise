const daysOfWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ]
  
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  
  export function dateToString(date: Date, excludeTime?: boolean) {
    const m = date.getMonth(); // e.g. 0 for Jan
    const wd = date.getDay(); // e.g. 3 for Tue
    const d = date.getDate(); // e.g. 1 for 1st
    const y = date.getFullYear(); // e.g. 1980
    const needsYear = y !== (new Date()).getFullYear();
  
    const sansTime = `${daysOfWeek[wd]} ${months[m]} ${d}${needsYear ? ', ' + y : '' }`;
  
    if (excludeTime) {
      return sansTime;
    }
  
    const min = date.getMinutes();
    const hr24 = date.getHours();
  
    const hr = (hr24 + 11) % 12 + 1;
    const pm = hr24 > hr || hr24 === 12;
  
    return `${sansTime} at ${hr}:${min < 10 ? '0' + min : min} ${pm ? 'PM' : 'AM'}`;
  }
  
  const MILLIS_IN_THREE_HOURS = 1000*60*60*3;
  
  const shiftBackThreeHours = (d: Date) => {
    const d2 = new Date(d)
    d2.setTime(d2.getTime() - MILLIS_IN_THREE_HOURS)
    return d2
  }
  
  export const sameDay = (d1: Date, d2: Date): boolean => {
    d1 = shiftBackThreeHours(d1)
    d2 = shiftBackThreeHours(d2)
    return !(d1.getDate() !== d2.getDate() ||
            d1.getMonth() !== d2.getMonth() ||
            d1.getFullYear() !== d2.getFullYear())
  }
  
  export const getDateReference = (d: Date): string => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    if (sameDay(d, today)) return "Today"
    else if (sameDay(d, yesterday)) return "Yesterday"
    else return dateToString(shiftBackThreeHours(d), true)
  }