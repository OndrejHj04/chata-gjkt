"use client";
import { uploadPhotosToAlbum } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import { Button } from "@mui/material";

export default function UploadAlbumPhoto({ album }: any) {
  const handleUploadPhoto = (e) => {
    if (e.target.files.length) {
      withToast(uploadPhotosToAlbum({ album, photos: e.target.files }), {
        message: "photogallery.album.uploadPhoto",
        onSuccess: () => window.location.reload()
      });
    }
  };

  return (
    <Button size="small" variant="contained" component="label">
      Přidat nové fotky
      <input
        type="file"
        multiple
        accept="image/png, image/jpg"
        hidden
        onChange={handleUploadPhoto}
      />
    </Button>
  );
}
