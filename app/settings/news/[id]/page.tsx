import { showNotification } from "@/api/news/show";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";

export default async function Page(props: ServerSideComponentProp) {
  const { id } = await props.params;

  const notificationDetail = await showNotification(id);
  return (
    <div className="flex gap-2 h-full flex-1">
      <Paper className="w-1/2 h-full p-2">
        <div className="flex flex-col gap-2">
          <TextField label="Název" value={notificationDetail.title} />
          <TextField
            label="Obsah"
            value={notificationDetail.content}
            multiline
            maxRows={5}
            minRows={5}
          />
        </div>
      </Paper>
      <Paper className="w-1/2 p-2">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
                <TableCell>Jméno</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Přečteno</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody className="overflow-y-auto">
              {notificationDetail.user_read.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {dayjs(user.read).format("DD. MM. YYYY HH:mm")}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      className="!p-0"
                      size="small"
                      variant="text"
                      component={Link}
                      href={`/user/detail/${user.id}`}
                    >
                      detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
