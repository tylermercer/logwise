const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const daysOfWeekShort = daysOfWeek.map(s => s.substring(0, 3));

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

const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

const isSameWeek = (a: Date, b: Date) => {
  const firstDayOfWeek = new Date(a);
  firstDayOfWeek.setDate(a.getDate() - a.getDay());

  const lastDayOfWeek = new Date(a);
  lastDayOfWeek.setDate(a.getDate() + (6 - a.getDay()));

  return b >= firstDayOfWeek && b <= lastDayOfWeek;
};

const roundToDayMillis = (d: Date) => Math.round(d.getTime() / MILLIS_IN_DAY);

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const getDayRelativeDateString = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateAsMillis = roundToDayMillis(date);
  const todayAsMillis = roundToDayMillis(today);
  const yesterdayAsMillis = roundToDayMillis(yesterday);

  const isToday = dateAsMillis === todayAsMillis;
  const isYesterday = dateAsMillis === yesterdayAsMillis;

  if (isToday) {
    return `Today`;
  } else if (isYesterday) {
    return `Yesterday`;
  } else if (isSameWeek(today, date)) {
    return `${daysOfWeek[date.getDay()]}`;
  } else {
    return `${daysOfWeekShort[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
  }
}

export const dateToString = (date: Date) => {
  return `${getDayRelativeDateString(date)} at ${formatTime(date)}`;
}
