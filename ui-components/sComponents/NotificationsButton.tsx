"use client";

import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotificationsButton({ count }: any) {
  return (
    <IconButton onClick={() => {}}>
      <Badge badgeContent={count} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
}
