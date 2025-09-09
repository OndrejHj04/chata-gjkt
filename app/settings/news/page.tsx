import { Paper, Typography } from "@mui/material";
import React from "react";
import NewsForm from "./components/NewsForm";

export default async function News() {

  return (
    <div className="flex gap-2 h-full">
      <Paper className="w-1/2 h-full p-2">
        <NewsForm />
      </Paper>
      <Paper className="w-1/2 h-full p-2">
        <Typography variant="h5">Změny ve zprávách</Typography>
      </Paper>
    </div>
  );
}
