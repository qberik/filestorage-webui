export function getRelativeTimeString(utcTime: string): string {
  const now = new Date();
  const targetDate = new Date(utcTime);

  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (diffInDays > 0) {
    value = diffInDays;
    unit = "day";
  } else if (diffInHours > 0) {
    value = diffInHours;
    unit = "hour";
  } else if (diffInMinutes > 0) {
    value = diffInMinutes;
    unit = "minute";
  } else {
    value = diffInSeconds;
    unit = "second";
  }

  const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });
  return rtf.format(-value, unit);
}
// const utcTime = "2023-07-18T12:00:00Z";
// console.log(getRelativeTimeString(utcTime)); // Outputs something like "1 день назад"
