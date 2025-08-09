"use client";
import { Button, Modal, Paper, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function ChangeProfilePictureModal({open, setOpen}: {open:boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const imageReady = image && imageUrl;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <Modal open={open} onClose={()=>setOpen(false)}>
      <Paper className="p-2 min-w-[300px] flex flex-col gap-2 items-center" style={style}>
        <Typography variant="h5" className="text-center">
          Změnit profilový obrázek
        </Typography>
        {imageReady && (
          <Image
            src={imageUrl}
            width={100}
            height={100}
            alt="profile-picture"
          />
        )}
        <Button variant={imageReady ? "outlined" : "contained"} component="label" className="w-full">
          {imageReady ? "Nahrát jinou fotografii" : "Nahrát fotografii"}
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
        {imageReady && <Button className="w-full" variant="contained">Uložit</Button>}
      </Paper>
    </Modal>
  );
}
