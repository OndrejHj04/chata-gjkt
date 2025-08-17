"use client";

import { createAlbum } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function Page() {
  const { back, replace } = useRouter();

  const [name, setName] = useState("");

  const handleCreateAlbum = async () => {
    await withToast(createAlbum(name), {
      message: "photogallery.createAlbum",
      onSuccess: () => replace("/photogallery/albums"),
    });
  };

  return (
    <Modal open={true} onClose={() => back()}>
      <Paper className="p-2 min-w-[300px] flex flex-col gap-2" style={style}>
        <Typography variant="h5" className="text-center">
          Vytvořit album
        </Typography>
        <TextField
          value={name}
          label="Jméno alba"
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          disabled={!name.length}
          variant="contained"
          size="small"
          onClick={handleCreateAlbum}
        >
          Vytvořit
        </Button>
      </Paper>
    </Modal>
  );
}
