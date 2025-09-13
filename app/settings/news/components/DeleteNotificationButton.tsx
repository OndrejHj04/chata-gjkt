"use client";

import DestroyNotificaion from "@/api/news/destroy";
import { withToast } from "@/utils/toast/withToast";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function DeleteNotificationButton({ id }: any) {
  const { refresh } = useRouter();

  const handleDeleteNotification = () => {
    withToast(DestroyNotificaion(id), { message: "news.destroy" });
    refresh();
  };

  return (
    <Button
      className="!py-0"
      size="small"
      variant="text"
      color="error"
      onClick={handleDeleteNotification}
    >
      odstranit
    </Button>
  );
}
