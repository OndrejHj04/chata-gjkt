"use client";

import { Visibility } from "@/constants/visibility";
import { changeAlbumVisibility } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import { FormControlLabel, Switch } from "@mui/material";

export default function ChangeAlbumPublicity({ album }: any) {
  const handleSetVisibility = async (state: Visibility["name"]) => {
    withToast(
      changeAlbumVisibility({ newVisibility: state, album: album.name }),
      { message: "photogallery.album.changeVisibility" }
    );
  };

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            defaultChecked={album.visibility === "veřejné"}
            onChange={(e) =>
              handleSetVisibility(e.target.checked ? "veřejné" : "soukromé")
            }
          />
        }
        label="Veřejné album"
      />
    </>
  );
}
