export function isNowWithinTimeRange(
  startTime: string,
  endTime: string
): boolean {
  const now = new Date();

  const start = new Date(startTime);
  const end = new Date(endTime);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
}
