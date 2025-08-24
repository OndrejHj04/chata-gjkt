import { getGalleryFeed } from "@/lib/api";
import { Typography } from "@mui/material";
import React from "react";
import ShowPhoto from "./components/ShowPhoto";

export default async function PhotoFeed() {
  const { data } = await getGalleryFeed();

  return (
    <div className="flex flex-col gap-2">
      {data.map(({ date, photos }: any) => (
        <div key={date}>
          <Typography variant="h5">{date}</Typography>
          {photos.map((photo: any) => (
            <ShowPhoto key={photo} photoUrl={photo} />
          ))}
        </div>
      ))}
    </div>
  );
}
