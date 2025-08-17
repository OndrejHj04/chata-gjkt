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

  return (
    <div>
      <Button onClick={handleCreateAlbum}>test</Button>
    </div>
  );
}
