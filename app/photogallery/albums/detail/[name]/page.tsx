import { getAlbumDetail } from "@/lib/api";
import { CardHeader, Paper, Typography } from "@mui/material";
import dayjs from "@/lib/dayjsExtended";
import UploadAlbumPhoto from "./components/UploadAlbumPhoto";
import DeleteAlbumButton from "./components/DeleteAlbumButton";
import ShowAlbumPhoto from "./components/ShowAlbumPhoto";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import ChangeAlbumPublicity from "./components/ChangeAlbumPublicity";

export default async function Page({ params }: any) {
  const { name } = await params;

  const { data: album } = await getAlbumDetail(decodeURIComponent(name));

  return (
    <div className="flex flex-col gap-2">
      <Paper className="p-2">
        <Typography variant="h5">Název alba: {album.name}</Typography>
        <Typography variant="h6">Majitel alba</Typography>
        <CardHeader
          className="!p-0"
          avatar={
            <AvatarWrapper data={{ image: album.owner.photo }} size={56} />
          }
          title={
            <Typography variant="h5">
              {album.owner.first_name} {album.owner.last_name}
            </Typography>
          }
        />
        <Typography>
          Vytvořeno: {dayjs(album.created_at).format("DD. MM. YYYY hh:mm")}
        </Typography>
        <Typography>
          Naposledy upraveno:{" "}
          {dayjs(album.updated_at).format("DD. MM. YYYY hh:mm")}
        </Typography>
        <div className="flex gap-2">
          <UploadAlbumPhoto album={album.name} />
          <DeleteAlbumButton album={album.name} />
          <ChangeAlbumPublicity album={album} />
        </div>
      </Paper>
      <Paper className="p-2">
        {album.images.map((image: any) => (
          <ShowAlbumPhoto
            key={image.publicUrl}
            photoUrl={image.publicUrl}
            photoName={image.name}
            albumName={decodeURIComponent(name)}
          />
        ))}
      </Paper>
    </div>
  );
}
