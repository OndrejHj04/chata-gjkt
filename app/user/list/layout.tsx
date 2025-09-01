import SearchBar from "@/ui-components/SearchBar";
import { Paper } from "@mui/material";
import React from "react";
import ExportButton from "@/ui-components/ExportButton";
import TableFilterSelect from "@/ui-components/TableFilterSelect";
import { Role } from "@/constants/role";
import { Organization } from "@/constants/organization";

export default function UserListLayout({
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
          className="md:w-80 w-32"
          label="Hledat uživatele"
        />
        <div className="flex-1 flex justify-end gap-2 items-center">
          <TableFilterSelect
            name="verified"
            label="Ověření"
            options={[
              { name: "Pouze ověření", value: 1 },
              { name: "Pouze neověření", value: 0 },
            ]}
          />
          <TableFilterSelect
            name="role"
            label="Role"
            options={Role.getAllRoles().map(role => ({ name: role.name }))}
          />
          <TableFilterSelect
            name="organization"
            label="Organizace"
            options={Organization.getAllOrganizations().map(org => ({ name: org.name }))}
          />
          <ExportButton entity="users" />
        </div>
      </div>
      <Paper>{children}</Paper>
    </React.Fragment>
  );
}
