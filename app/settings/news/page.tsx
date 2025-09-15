import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import NewsForm from "./components/NewsForm";
import { getNewsList } from "@/api/news/index";
import dayjs from "@/lib/dayjsExtended";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import TableListPagination from "@/ui-components/TableListPagination";
import Link from "next/link";
import DeleteNotificationButton from "./components/DeleteNotificationButton";

export default async function News(props: ServerSideComponentProp) {
  const { page } = await props.searchParams;

  const { data, count } = await getNewsList({ page });

  return (
    <div className="flex gap-2 h-full">
      <Paper className="w-1/2 h-full p-2">
        <NewsForm />
      </Paper>
      <Paper className="w-1/2 h-full p-2">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
                <TableCell>Název</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Zveřejněno</TableCell>
                <TableCell>Zobrazeno</TableCell>
                <TableListPagination count={count} />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((news) => (
                <TableRow key={news.id}>
                  <TableCell className="truncate max-w-xs">
                    {news.title}
                  </TableCell>
                  <TableCell>{news.author_name}</TableCell>
                  <TableCell>
                    {dayjs(news.author).format("DD. MM. YYYY hh:mm")}
                  </TableCell>
                  <TableCell>{news.viewed}</TableCell>
                  <TableCell align="right">
                    <Button
                      className="!p-0"
                      size="small"
                      variant="text"
                      component={Link}
                      href={`/settings/news/${news.id}`}
                    >
                      detail
                    </Button>
                    <DeleteNotificationButton id={news.id} />
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
