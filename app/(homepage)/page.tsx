import ReservationsWidget from "./ReservationsWidget";
import RegistrationWidget from "./RegistrationWidget";
import FullcalendarComponent from "./Fullcalendar";
import { getReservationCalendarData } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

export default async function Page({ searchParams }: { searchParams: any }) {
  const { firstRoom, secondRoom, thirdRoom, fourthRoom, fifthRoom } = await searchParams;
  const roomsFilter = [Boolean(firstRoom), Boolean(secondRoom), Boolean(thirdRoom), Boolean(fourthRoom), Boolean(fifthRoom)].filter(Boolean)

  const data = await getReservationCalendarData({ rooms: roomsFilter });
  const user = (await getServerSession(authOptions)) as any;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex sm:flex-row flex-col gap-2">
        <div className="flex flex-col gap-2">
          <RegistrationWidget />
          <ReservationsWidget />
        </div>
        <FullcalendarComponent data={data} role={user?.user.role} />
      </div>
    </div>
  );
}
