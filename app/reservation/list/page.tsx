import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TableListPagination from "@/ui-components/TableListPagination";
import { getReservationList } from "@/lib/api";
import ReservationListItem from "../list/components/ReservationListItem";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SortableColumn from "../../../ui-components/SortableColumn";

export default async function ReservationList({
  searchParams,
}: {
  searchParams: any;
}) {
  const { user } = (await getServerSession(authOptions)) as any;
  const {
    page = 1,
    status,
    search = "",
    registration = 0,
    sort = "",
    dir = "",
  } = await searchParams;
  const { data, count } = (await getReservationList({
    page,
    status,
    search,
    registration: Number(registration),
    sort,
    dir,
  })) as any;
  const isAdmin = user.role.id !== 3;

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
            <TableCell padding="none" className="w-[150px]">
              <TableListPagination count={count} name="page" rpp={10} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((reservation: any) => {
            return (
              <ReservationListItem
                key={reservation.id}
                reservation={reservation}
                userId={user.id}
                isAdmin={isAdmin}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
