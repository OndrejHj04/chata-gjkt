import AvatarWrapper from "@/ui-components/AvatarWrapper";
import TableListPagination from "@/ui-components/TableListPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ReservationUsersRemoveButton from "../components/ReservationUsersRemoveButton";
import { requireAuthServerSession } from "@/lib/authServerSession";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { getUserList } from "@/api/users/index";
import { getReservationDetail } from "@/api/reservations/show";

export default async function ReservationUsersTable(
  props: ServerSideComponentProp
) {
  const { page } = await props.searchParams;
  const { id } = await props.params;

  const { data, count } = await getUserList({
    reservation: id,
    page,
  });

  const user = await requireAuthServerSession()
  await getReservationDetail(id)
  const isAdmin = user.role === "admin";
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Jméno</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Organizace</TableCell>
            <TableCell>Ověření</TableCell>
            <TableListPagination count={count} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <AvatarWrapper data={{ image: user.image }} />
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.organization_name}</TableCell>
              <TableCell>{user.verified}</TableCell>
              <TableCell align="right">
                {isAdmin && (
                  <ReservationUsersRemoveButton
                    reservationId={id}
                    userId={user.id}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
