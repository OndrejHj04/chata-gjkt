"use client";

import { uploadImage } from "@/lib/api";
import { Button } from "@mui/material";

export default function UploadImage() {
  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const imageFile = formData.get("image");

    uploadImage(imageFile);
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="image" type="file" />
      <Button type="submit">upload</Button>
    </form>
  );
}
