import { Dayjs } from "dayjs";

export function isBetween(start: Dayjs, check: Dayjs, end: Dayjs) {
  return start.isBefore(check) && check.isBefore(end);
}
