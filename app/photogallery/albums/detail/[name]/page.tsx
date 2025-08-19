import { getAlbumDetail } from "@/lib/api";
import { Checkbox, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import UploadAlbumPhoto from "./components/UploadAlbumPhoto";
import RemoveAlbumPhotos from "./components/RemoveAlbumPhotos";

export default async function Page({ params }: any) {
  const { name } = await params;

  const { data: album } = await getAlbumDetail(name);

  return (
    <div className="flex flex-col gap-2">
      <Paper className="p-2">
        <Typography variant="h5">Název alba: {name}</Typography>
        <Typography>
          Vytvořeno: {dayjs(album.created_at).format("DD. MM. YYYY hh:mm")}
        </Typography>
        <Typography>
          Naposledy upraveno:{" "}
          {dayjs(album.updated_at).format("DD. MM. YYYY hh:mm")}
        </Typography>
        <div className="flex gap-2">
          <UploadAlbumPhoto album={name} />
          <RemoveAlbumPhotos album={name} />
        </div>
      </Paper>
      <Paper className="p-2 flex flex-wrap">
        {album.images.map((image, i) => (
          <div className="relative" key={i}>
            <Checkbox className="!absolute !p-0 top-0" />
            <Image src={image.publicUrl} width={100} height={100} alt="idk" />
          </div>
        ))}
      </Paper>
    </div>
  );
}
