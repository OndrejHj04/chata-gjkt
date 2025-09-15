import { getReservationList } from "@/api/reservations/index"
import dayjs from "@/lib/dayjsExtended"
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import TableListPagination from "@/ui-components/TableListPagination"
import { Icon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

export default async function UserReservationsTable(props: ServerSideComponentProp) {
  const { page } = await props.searchParams;
  const { id } = await props.params;

  const {data, count} = await getReservationList({page, user: id})
  
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Název</TableCell>
            <TableCell>Začátek</TableCell>
            <TableCell>Konec</TableCell>
            <TableCell>Počet účastníků</TableCell>
            <TableCell>Vedoucí</TableCell>
            <TableCell>Status</TableCell>
            <TableListPagination count={count} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((reservation: any) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.name}</TableCell>
              <TableCell>{dayjs(reservation.from_date).format("DD. MMMM YYYY")}</TableCell>
              <TableCell>{dayjs(reservation.to_date).format("DD. MMMM YYYY")}</TableCell>
              <TableCell>{reservation.users_count}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AvatarWrapper data={{ image: reservation.leader_image }} />
                  {reservation.leader_name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Icon sx={{ color: reservation.status_color }} className="mr-2">
                    {reservation.status_icon}
                  </Icon>
                  {reservation.status_name}
                </div>
              </TableCell>
              <TableCell align="right">
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
