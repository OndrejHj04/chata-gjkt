import SearchBar from "@/ui-components/SearchBar";
import { Paper } from "@mui/material";
import React from "react";

export default function GroupListLayout({ children }: { children: any }) {
  return (
    <React.Fragment>
      <div className="flex">
        <div className="flex-1 md:flex hidden" />
        <SearchBar label="Hledat skuipiny" />
        <div className="flex-1 flex" />
      </div>
      <Paper>{children}</Paper>
    </React.Fragment>
  );
}
