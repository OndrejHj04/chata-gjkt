"use client";

import { AccordionSummary, Typography } from "@mui/material";
import dayjs from "dayjs";
import { updateNews } from "@/api/news/update";
import { useRouter } from "next/navigation";

export default function NewsReadableSection({ item, user }: any) {
  const { refresh } = useRouter();

  const handleClick = () => {
    updateNews({ id: item.id, user });
    refresh();
  };

  console.log(item);
  return (
    <AccordionSummary onClick={handleClick}>
      <div className="flex justify-between w-full">
        <Typography variant="body2">
          {dayjs(item.created_at).format("DD. MM. YYYY HH:mm")}
          {" | "}
          {item.title}
        </Typography>
        {item.read ? (
          <Typography color="info">Přečteno</Typography>
        ) : (
          <Typography color="success">Přečíst</Typography>
        )}
      </div>
    </AccordionSummary>
  );
}
