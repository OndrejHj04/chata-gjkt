import { Button, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";

import Image from "next/image";
import { getImages } from "@/lib/api";
import UploadImage from "./UploadImage";

export default async function WelcomeComponent() {
  const imageUrls = await getImages()

  console.log(imageUrls);
  return (
    <div className="flex flex-col gap-2">
      <Paper className="w-full p-2">
        <Typography variant="h5">
          Vítejte na stránkách rezervačního systému Chata GJKT.
        </Typography>
      </Paper>
      {imageUrls?.map((image) => (
        <Image key={image.id} alt={image.name} src={image.publicUrl} width={100} height={100}/>
      ))}
      <UploadImage />
      <div className="flex gap-2 md:flex-row flex-col">
        <LoginForm />
        <Paper className="p-2 flex flex-col">
          <Typography variant="h6" className="text-center">
            Nebo pokračujte v režimu hosta
          </Typography>
          <Divider flexItem />
          <div className="flex-1">
            <Typography
              className="w-0 text-justify text-sm"
              color="text.secondary"
              style={{ minWidth: "100%" }}
            >
              Režim hosta slouží pouze na prohlížení aplikace s testovacími daty
              a vytvořené požadavky nebo rezervace nebudou uloženy.
            </Typography>
          </div>
          <Button disabled={true} variant="contained">
            Pokračovat jako host
          </Button>
        </Paper>
        <ResetPassword />
      </div>
    </div>
  );
}
