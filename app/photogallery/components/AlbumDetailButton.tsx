"use client";

import { Button, TableCell } from "@mui/material";
import Link from "next/link";

export default function AlbumDetailButton({ name }: any) {
  return (
    <TableCell
      align="right"
      className="min-w-[150px]"
      onClick={(e) => e.stopPropagation()}
    >
      <Button component={Link} href={`/photogallery/albums/detail/${name}`}>
        detail
      </Button>
    </TableCell>
  );
}
