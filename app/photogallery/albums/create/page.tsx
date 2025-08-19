"use client";

import { Visibility } from "@/constants/visibility";
import { createAlbum } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import {
  Button,
  FormControlLabel,
  Modal,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
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
  const [visibility, setVisibility] = useState<Visibility["name"]>("veřejné");

  const handleCreateAlbum = async () => {
    await withToast(createAlbum(name, visibility), {
      message: "photogallery.createAlbum",
      onSuccess: () => replace("/photogallery/albums/list"),
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
        <FormControlLabel
          control={
            <Switch
              checked={visibility === "veřejné"}
              onChange={(e) =>
                setVisibility(e.target.checked ? "veřejné" : "soukromé")
              }
            />
          }
          label="Veřejné album"
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
