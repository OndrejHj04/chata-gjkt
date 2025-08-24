"use client";

import { deletePhotoFromAlbum } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import { Button, Modal } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  outline: "none",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "90vw",
  maxHeight: "90vh",
};

export default function ShowPhoto({ photoUrl, photoName, albumName }: any) {
  const [open, setOpen] = useState(false);

  const handleRemovePhoto = () => {
    withToast(deletePhotoFromAlbum({ album: albumName, photo: photoName }), {
      message: "photogallery.album.deletePhoto",
      onSuccess: () => window.location.reload(),
    });
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <div className="absolute right-0 bottom-0 p-2">
            <Button color="error" onClick={handleRemovePhoto}>
              Odstranit
            </Button>
          </div>
          <div style={style}>
            <img
              src={photoUrl}
              onClick={() => setOpen(true)}
              className="w-auto h-auto max-w-full max-h-[90vh]"
            />
          </div>
        </div>
      </Modal>
      <img
        onClick={() => setOpen(true)}
        src={photoUrl}
        alt=""
        className="max-h-[200px]"
      />
    </>
  );
}
