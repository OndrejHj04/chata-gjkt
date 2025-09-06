import { getSendMails } from "@/lib/api";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import TableListPagination from "@/ui-components/TableListPagination";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";

export default async function Page(props: ServerSideComponentProp) {
  const { page } = await props.searchParams;
  const { data, count } = await getSendMails({ page });

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
              <TableCell>Datum odeslání</TableCell>
              <TableCell>Předmět</TableCell>
              <TableCell>Obsah</TableCell>
              <TableListPagination count={count} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((mail: any) => {
              const truncateRecipients =
                mail.recipients.split(",").length > 2
                  ? `${mail.recipients.split(",").slice(0, 2).join(",")}...`
                  : mail.recipients;
              const truncateContent =
                mail.content.length > 100
                  ? `${mail.content.slice(0, 100)}...`
                  : mail.content;
              return (
                <TableRow key={mail.id}>
                  <TableCell className="w-1 whitespace-nowrap">
                    {dayjs(mail.date).format("DD. MM. YYYY HH:mm")}
                  </TableCell>
                  <TableCell className="w-1 whitespace-nowrap">
                    <Typography>{mail.subject}</Typography>
                    <Typography variant="caption" color="gray">
                      {truncateRecipients}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="inherit" className="whitespace-nowrap">
                      {truncateContent}
                    </Typography>
                  </TableCell>
                  <TableCell className="w-1">
                    <Link href={`/mailing/send/detail/${mail.id}`}>
                      <Button variant="text">detail</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
