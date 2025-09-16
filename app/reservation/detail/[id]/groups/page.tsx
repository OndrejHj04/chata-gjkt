import { getGroupList } from "@/api/group/index";
import { getReservationDetail } from "@/api/reservations/show";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
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

export default async function ReservationGroupsTable(
  props: ServerSideComponentProp
) {
  const { page } = await props.searchParams;
  const { id } = await props.params;

  const { data, count } = await getGroupList({ page, reservation: id });
  await getReservationDetail(id)

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Název</TableCell>
            <TableCell>Popis</TableCell>
            <TableCell>Majitel</TableCell>
            <TableListPagination count={count} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((group: any) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.description}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <AvatarWrapper data={{ image: group.owner.image }} />
                  {group.owner.first_name} {group.owner.last_name}
                </div>
              </TableCell>
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
