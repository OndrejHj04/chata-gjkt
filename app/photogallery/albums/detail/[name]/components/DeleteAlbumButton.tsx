"use client";

import { deleteAlbum } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function DeleteAlbumButton({ album }: any) {
  const { replace } = useRouter();

  const handleDeleteButton = async () => {
    withToast(deleteAlbum(album), {
      message: "photogallery.album.delete",
      onSuccess: () => replace("/photogallery/albums/list"),
    });
  };

  return (
    <Button color="error" variant="outlined" onClick={handleDeleteButton}>
      Odstranit album
    </Button>
  );
}
