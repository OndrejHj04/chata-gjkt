import { getAlbumDetail } from "@/lib/api";
import { Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";

export default async function Page({ params }: any) {
  const { name } = await params;

  const { data: album } = await getAlbumDetail(name);

  return (
    <div className="flex flex-col gap-2">
      <Paper className="p-2">
        <Typography variant="h5">Název alba: {name}</Typography>
        <Typography>
          Vytvořeno: {dayjs(album.creted_at).format("DD. MM. YYYY hh:mm")}
        </Typography>
        <Typography>
          Naposledy upraveno: {dayjs(album.updated_at).format("DD. MM. YYYY hh:mm")}
        </Typography>
      </Paper>
      <Paper className="p-2">
        {album.images.map((image, i)=>(
          <Image key={i} src={image.publicUrl} width={100} height={100} alt="idk" />
        ))}
      </Paper>
    </div>
  );
}
