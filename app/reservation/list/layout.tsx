import { Paper } from "@mui/material";
import React from "react";
import SearchBar from "@/ui-components/SearchBar";
import ExportButton from "@/ui-components/ExportButton";
import TableFilterSelect from "@/ui-components/TableFilterSelect";
import { Status } from "@/constants/status";

export default function ReservationListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <div className="flex">
        <div className="flex-1 md:flex hidden" />
        <SearchBar
          variant="standard"
          className="md:w-80 w-40"
          label="Hledat rezervace"
        />
        <div className="flex-1 flex items-center gap-2 justify-end">
          <TableFilterSelect
            name="registration"
            label="Registrace"
            options={[
              { name: "Běží", value: 1 },
              { name: "Nespuštěná", value: 0 },
            ]}
          />
          <TableFilterSelect
            name="status"
            label="Status"
            options={Status.getAllStatus().map((org) => ({ name: org.name }))}
          />
          <ExportButton entity="reservations" />
        </div>
      </div>
      <Paper>{children}</Paper>
    </React.Fragment>
  );
}
