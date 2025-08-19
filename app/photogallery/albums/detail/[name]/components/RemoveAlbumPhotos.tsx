"use client";
import { Button } from "@mui/material";

export default function RemoveAlbumPhotos() {
  const handleRemovePhotos = () => {};

  return (
    <Button size="small" color="error" variant="outlined" onClick={handleRemovePhotos}>
      Odstranit vybrané fotky
    </Button>
  );
}
