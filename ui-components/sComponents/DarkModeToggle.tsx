"use client";
import { setTheme } from "@/api/theme/update";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@mui/material";

export default function DarkModeToggle({ theme }: { theme: any }) {
  return (
    <IconButton onClick={() => setTheme().then(() => window.location.reload())}>
      {theme ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
