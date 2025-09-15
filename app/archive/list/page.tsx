import { getReservationList } from "@/api/reservations/index";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import SortableColumn from "@/ui-components/SortableColumn";
import TableListPagination from "@/ui-components/TableListPagination";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "@/lib/dayjsExtended";

export default async function ArchivePage(props: ServerSideComponentProp) {
  const { page, search, registration, sort, dir } = await props.searchParams;

  const { data, count } = await getReservationList({
    page,
    status: "archiv",
    search,
    registration,
    sort,
    dir,
  });

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <SortableColumn id="r.name">Název</SortableColumn>
            <SortableColumn id="r.creation_date">
              Datum vytvoření
            </SortableColumn>
            <SortableColumn id="r.from_date">Začátek</SortableColumn>
            <SortableColumn id="r.to_date">Konec</SortableColumn>
            <SortableColumn id="users_count">Účastníci</SortableColumn>
            <TableCell>Vedoucí</TableCell>
            <TableListPagination count={count} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((reservation: any) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.name}</TableCell>
              <TableCell>
                {dayjs(reservation.creation_date).format("DD. MM. YYYY")}
              </TableCell>
              <TableCell>
                {dayjs(reservation.from_date).format("DD. MM. YYYY")}
              </TableCell>
              <TableCell>
                {dayjs(reservation.to_date).format("DD. MM. YYYY")}
              </TableCell>
              <TableCell>{reservation.users_count}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AvatarWrapper data={{ image: reservation.leader_image }} />
                  {reservation.leader_name}
                </div>
              </TableCell>
              <TableCell align="right">
                <Button href={`/reservation/detail/${reservation.id}/info`}>
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
