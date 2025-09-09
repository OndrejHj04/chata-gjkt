import {
  getUsersAvaliableGroups,
  getUsersAvaliableReservations,
} from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import UserListItem from "./components/UserListItem";
import TableListPagination from "@/ui-components/TableListPagination";
import SortableColumn from "@/ui-components/SortableColumn";
import { getUserList } from "@/api/users/index";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { requireAuthServerSession } from "@/lib/authServerSession";

export default async function UserList(props: ServerSideComponentProp) {
  const { page, search, role, organization, verified, sort, dir } =
    await props.searchParams;

  const user = await requireAuthServerSession()
  const isAdmin = user.role !== "veřejnost";

  const { data, count } = await getUserList({
    page,
    search,
    role,
    organization,
    verified,
    sort,
    dir,
  });

  const { groups: avaliableGroups } = await getUsersAvaliableGroups(user.id);
  const { reservations: avaliableReservations } =
    await getUsersAvaliableReservations(user.id);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell />
            <SortableColumn id="u.first_name">Jméno</SortableColumn>
            <SortableColumn id="u.email">Email</SortableColumn>
            {isAdmin && <SortableColumn id="u.role">Role</SortableColumn>}
            {isAdmin && (
              <SortableColumn id="u.organization">Organizace</SortableColumn>
            )}
            {isAdmin && (
              <SortableColumn id="u.verified">Ověření</SortableColumn>
            )}
            <TableListPagination count={count} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user: any) => (
            <UserListItem
              key={user.id}
              user={user}
              childrenData={user.children}
              avaliableGroups={avaliableGroups}
              avaliableReservations={avaliableReservations}
              isAdmin={isAdmin}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
