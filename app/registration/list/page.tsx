import { getRegistrationList } from "@/lib/api";
import { dayjsExtended } from "@/lib/dayjsExtended";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
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
import Link from "next/link";

export default async function RegistrationList({
  searchParams,
}: {
  searchParams: any;
}) {
  const { page } = searchParams;
  const { data, count } = await getRegistrationList({
    page: Number(page) || 1,
  });

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Zapnuto</TableCell>
            <TableCell>Autor</TableCell>
            <TableCell>Počet nevyřízených registrací</TableCell>
            <TableCell>Začátek rezervace</TableCell>
            <TableListPagination count={count} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((registration: any, i: any) => (
            <TableRow key={i}>
              <TableCell>
                {dayjsExtended(registration.timestamp).format("DD. MMMM HH:mm")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AvatarWrapper data={registration.author} size={34} />
                  {registration.author.first_name}{" "}
                  {registration.author.last_name}
                </div>
              </TableCell>
              <TableCell>{registration.outside_registration_count}</TableCell>
              <TableCell>
                {dayjs(registration.from_date).format("DD. MM. YYYY")}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Button
                    component={Link}
                    size="small"
                    href={registration.form_public_url}
                    target="_blank"
                  >
                    Přihlašovací formulář
                  </Button>
                  <Button
                    component={Link}
                    size="small"
                    href={`/reservation/detail/${registration.reservation_id}/registration`}
                  >
                    Detail registrace
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
