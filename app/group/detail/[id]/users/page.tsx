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
import GroupUsersRemoveButton from "../components/GroupUsersRemoveButton";
import { getUserList } from "@/api/users/index";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { requireAuthServerSession } from "@/lib/authServerSession";
import { getGroupDetail } from "@/api/group/show";

export default async function GroupUsersTable(props: ServerSideComponentProp) {
  const { id } = await props.params;
  const { page } = await props.searchParams;
  const user = await requireAuthServerSession();

  const { data, count } = await getUserList({ group: id, page });
  const group = await getGroupDetail(id);

  const isAdmin = user.role === "admin" || user.id === group.owner.id;

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
                <div className="flex items-center gap-2">
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
                  <GroupUsersRemoveButton userId={user.id} groupId={id} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
