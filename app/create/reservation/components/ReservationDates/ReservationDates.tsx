import { requireAuthServerSession } from "@/lib/authServerSession";
import ReservationDatesRender from "./ReservationDatesRender";
import { getReservationsByWeekCalendar } from "@/lib/api";

export default async function ReservationDates() {
  const { data } = await getReservationsByWeekCalendar()
  const user = await requireAuthServerSession()

  return <ReservationDatesRender reservations={data} user={user} />;
}
