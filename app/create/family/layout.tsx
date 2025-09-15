import { Paper, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Tabs value={"family"} variant="scrollable">
        <Tab
          value="reservation"
          label="Vytvořit rezervaci"
          component={Link}
          href={`/create/reservation`}
        />
        <Tab
          value="user"
          label="Vytvořit uživatele"
          component={Link}
          href={`/create/user`}
        />
        <Tab
          value="group"
          label="Vytvořit skupinu"
          component={Link}
          href={`/create/group`}
        />
        <Tab
          value="family"
          label="Vytvořit účet rodinného příslušníka"
          component={Link}
          href={`/create/family`}
        />
        <Tab
          value="import"
          label="Importovat uživatele"
          component={Link}
          href={`/create/import`}
        />
      </Tabs>
      <Paper className="p-2">{children}</Paper>
    </React.Fragment>
  );
}
