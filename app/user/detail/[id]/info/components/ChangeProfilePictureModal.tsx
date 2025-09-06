"use client";
import { uploadProfilePicture } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import { Button, Modal, Paper, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function ChangeProfilePictureModal({open, setOpen, userId}: {open:boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, userId: number}) {
  const { refresh } = useRouter()
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const imageReady = image && imageUrl;

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleUploadProfilePicture = () => {
    withToast(uploadProfilePicture(image,userId), {message: "user.detail.updateProfilePicture"})
    setOpen(false)
    refresh()
  }

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
          <input type="file" accept="image/png, image/jpg" hidden onChange={handleImageChange} />
        </Button>
        {imageReady && <Button className="w-full" variant="contained" onClick={handleUploadProfilePicture}>Uložit</Button>}
      </Paper>
    </Modal>
  );
}
