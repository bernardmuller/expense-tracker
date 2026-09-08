export const computeScheduledDate = (day: number): Date => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  while (new Date(year, month + 1, 0).getDate() < day) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  return new Date(
    year,
    month,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  );
};
