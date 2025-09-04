import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { getGroupUsers } from "@/lib/api"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import TableListPagination from "@/ui-components/TableListPagination"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { getServerSession } from "next-auth"
import GroupUsersRemoveButton from "./GroupUsersRemoveButton"

export default async function GroupUsersTable({ id, page = 1 }: { id: any, page: any }) {
  const { data, count } = await getGroupUsers({ groupId: id, page: page })
  const { user } = await getServerSession(authOptions) as any
  const isAdmin = user.role !== 'veřejnost'

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
              <TableCell>{user.organization}</TableCell>
              <TableCell>{user.verified}</TableCell>
              <TableCell align="right">
                {isAdmin && <GroupUsersRemoveButton userId={user.id} groupId={id} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
