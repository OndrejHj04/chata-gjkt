import { getAlbumDetail } from "@/lib/api";
import { Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import UploadAlbumPhoto from "./components/UploadAlbumPhoto";
import ShowImage from "@/app/photogallery/albums/components/ShowPhoto";
import DeleteAlbumButton from "./components/DeleteAlbumButton";

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
          <DeleteAlbumButton album={name} />
        </div>
      </Paper>
      <Paper className="p-2 flex flex-wrap">
        {album.images.map((image, i) => (
          <ShowImage
            key={i}
            photoUrl={image.publicUrl}
            photoName={image.name}
            albumName={name}
          />
        ))}
      </Paper>
    </div>
  );
}
