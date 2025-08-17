"use client";

import { createAlbum } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import { Button } from "@mui/material";

export default function CreateAlbumButton() {
  const handleCreateAlbum = () => {
    withToast(createAlbum("marin12asfd3"), {
      message: "photogallery.createAlbum",
    });
  };

  return <Button variant="outlined" size="small" onClick={handleCreateAlbum}>Vytvořit nové album</Button>;
}
