import { getUserAlbums } from "@/lib/api";
import CreateAlbumButton from "./CreateAlbumButton";

export default async function MyPhotos() {
  const {data: albums} = await getUserAlbums();

  console.log(albums)
  return (
    <div>
      <CreateAlbumButton />
    </div>
  );
}
