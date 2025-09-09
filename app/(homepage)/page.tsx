import FullcalendarComponent from "./components/Fullcalendar";
import {
  getReservationCalendarData,
  getUserRegistrationWidgetData,
} from "@/lib/api";
import {
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { requireAuthServerSession } from "@/lib/authServerSession";
import Link from "next/link";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import { getReservationList } from "@/api/reservations/index";

export default async function Page({ searchParams }: { searchParams: any }) {
  const { firstRoom, secondRoom, thirdRoom, fourthRoom, fifthRoom } =
    await searchParams;
  const roomsFilter = [
    Boolean(firstRoom),
    Boolean(secondRoom),
    Boolean(thirdRoom),
    Boolean(fourthRoom),
    Boolean(fifthRoom),
  ].filter(Boolean);

  const calenderData = await getReservationCalendarData({ rooms: roomsFilter });
  const user = await requireAuthServerSession()

  const registrationData = await getUserRegistrationWidgetData({
    userId: user.id,
  });
  const { data: reservationData, count } = await getReservationList({
    user: user.id.toString(),
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex sm:flex-row flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Paper className="p-2 flex flex-col flex-1 min-w-[300px] max-h-full overflow-hidden">
            <div className="flex justify-between items-center gap-3">
              <CreateIcon color="primary" />
              <Typography variant="h5">Moje registrace</Typography>
              <CreateIcon color="primary" />
            </div>
            <div className="flex-1 overflow-y-auto min-h-[100px]">
              <MenuList disablePadding>
                {registrationData.map((reservation: any) => (
                  <MenuItem
                    key={reservation.id}
                    className="!px-0"
                    component={Link}
                    href={`/reservation/detail/${reservation.id}/registration`}
                  >
                    <ListItemText>{reservation.name}</ListItemText>
                    {reservation.user_count > 0 ? (
                      <Typography className="text-red-500">
                        Je nutné schválit účastníky!
                      </Typography>
                    ) : (
                      <Typography className="text-green-400">
                        Vše v pořádku!
                      </Typography>
                    )}
                  </MenuItem>
                ))}
              </MenuList>
            </div>
          </Paper>
          <Paper className="p-2 flex flex-col flex-1 min-w-[300px] max-h-full overflow-hidden">
            <div className="flex justify-between items-center gap-3">
              <EventIcon color="primary" />
              <Typography variant="h5">Moje rezervace</Typography>
              <EventIcon color="primary" />
            </div>
            <div className="flex-1 overflow-y-auto min-[100px]">
              <MenuList disablePadding>
                {reservationData.map((reservation: any) => (
                  <MenuItem
                    key={reservation.id}
                    className="!px-0"
                    component={Link}
                    href={`/reservation/detail/${reservation.id}/info`}
                  >
                    <ListItemText>{reservation.name}</ListItemText>
                    <Typography color="text.secondary">
                      {dayjs(reservation.from_date).format("DD. MM. YYYY")}
                    </Typography>
                  </MenuItem>
                ))}
              </MenuList>
            </div>
          </Paper>
        </div>
        <FullcalendarComponent data={calenderData} role={user.role} />
      </div>
    </div>
  );
}
