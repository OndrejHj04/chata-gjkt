import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TableListPagination from "@/ui-components/TableListPagination";
import ReservationListItem from "../list/components/ReservationListItem";
import React from "react";
import SortableColumn from "../../../ui-components/SortableColumn";
import { getReservationList } from "@/api/reservations/index";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { requireAuthServerSession } from "@/lib/authServerSession";

export default async function ReservationList(props: ServerSideComponentProp) {
  const currentUser = await requireAuthServerSession()
  const { page, status, search, registration, sort, dir } =
    await props.searchParams;

  const { data, count } = (await getReservationList({
    page,
    status,
    search,
    registration,
    sort,
    dir,
  })) as any;
  const isAdmin = currentUser.role === "admin";

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg [&_.MuiTableCell-root]:px-1">
            <SortableColumn id="r.name">Název</SortableColumn>
            <SortableColumn id="r.creation_date">
              Datum vytvoření
            </SortableColumn>
            <SortableColumn id="r.from_date">Začátek</SortableColumn>
            <SortableColumn id="r.to_date">Konec</SortableColumn>
            <SortableColumn id="users_count">Účastníci</SortableColumn>
            <TableCell>Registrace</TableCell>
            <TableCell>Vedoucí</TableCell>
            <TableCell>Lůžka</TableCell>
            <TableCell>Status</TableCell>
            <TableListPagination count={count} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((reservation: any) => {
            return (
              <ReservationListItem
                key={reservation.id}
                reservation={reservation}
                userId={currentUser.id}
                isAdmin={isAdmin}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
