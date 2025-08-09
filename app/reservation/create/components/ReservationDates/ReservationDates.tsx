import ReservationDatesRender from "./ReservationDatesRender";
import { getReservationsByWeekCalendar } from "@/lib/api";

export default async function ReservationDates() {
  const { data } = await getReservationsByWeekCalendar()

  return <ReservationDatesRender reservations={data} />;
}
