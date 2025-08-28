import { getAlbumList } from "@/lib/api";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import dayjs from "dayjs";
import AlbumDetailButton from "../../components/AlbumDetailButton";
import TableListPagination from "@/ui-components/TableListPagination";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function Page({ searchParams }: any) {
  const { page, visibility, search } = await searchParams;
  const { data: albums, count } = await getAlbumList({
    page,
    visibility,
    search,
  });
  const user = (await getServerSession(authOptions)) as any;

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Název</TableCell>
            <TableCell>Majitel</TableCell>
            <TableCell>Vytvořeno</TableCell>
            <TableCell>Naposledy upraveno</TableCell>
            <TableCell>Počet fotek</TableCell>
            <TableCell>Přístupnost</TableCell>
            <TableListPagination count={count} />
          </TableRow>
        </TableHead>
        <TableBody>
          {albums.map((album: any) => (
            <TableRow key={album.name}>
              <TableCell>{album.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AvatarWrapper data={{ image: album.owner.photo }} />
                  {album.owner.first_name} {album.owner.last_name}
                </div>
              </TableCell>
              <TableCell>
                {dayjs(album.created_at).format("DD. MMMM YYYY hh:mm")}
              </TableCell>
              <TableCell>
                {dayjs(album.updated_at).format("DD. MMMM YYYY hh:mm")}
              </TableCell>
              <TableCell>{album.photos_count}</TableCell>
              <TableCell>{album.visibility}</TableCell>
              {user.user.role.id !== 3 || user.user.id === album.owner.id ? (
                <AlbumDetailButton name={album.name} />
              ) : (
                <TableCell />
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
