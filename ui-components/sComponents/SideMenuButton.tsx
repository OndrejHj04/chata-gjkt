"use client";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { PanelContext } from "@/app/clientProvider";
import { useContext } from "react";

export default function SideMenuButton({ disabled }: { disabled: boolean }) {
  const { setPanel } = useContext(PanelContext);

  return (
    <IconButton disabled={disabled} onClick={() => setPanel(true)}>
      <MenuIcon />
    </IconButton>
  );
}
