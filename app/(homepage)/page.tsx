import CalendarWidget from "./CalendarWidget";
import ReservationsWidget from "./ReservationsWidget";
import RegistrationWidget from "./RegistrationWidget";
import { getNewRoles } from "@/lib/api";

export default async function Page({ searchParams }: { searchParams: any }) {
  const roles = await getNewRoles()
  console.log(roles)
  return (
    <div className="w-full h-full flex flex-col"> 
      <div className="flex-1 flex sm:flex-row flex-col gap-2">
        <div
          className="flex flex-col gap-2"
        >
          <RegistrationWidget />
          <ReservationsWidget />
        </div>
        <CalendarWidget searchParams={searchParams} />
      </div>
    </div>
  )
}
