import TableListPagination from "@/ui-components/TableListPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import GroupListItem from "./GroupListItem";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { getGroupList } from "@/api/group/index";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";

export default async function GroupList(props: ServerSideComponentProp) {
  const { page, search } = await props.searchParams;
  const { user } = (await getServerSession(authOptions)) as any;
  const isAdmin = user.role !== "veřejnost";
  const { data, count } = await getGroupList({
    page,
    search,
  });

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Název</TableCell>
            <TableCell>Popis</TableCell>
            <TableCell>Vlastník</TableCell>
            <TableCell className="whitespace-nowrap">Počet členů</TableCell>
            <TableListPagination count={count} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((group) => {
            const allowMenu = isAdmin || group.owner.id === user.id;
            return (
              <GroupListItem
                key={group.id}
                group={group}
                allowMenu={allowMenu}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
