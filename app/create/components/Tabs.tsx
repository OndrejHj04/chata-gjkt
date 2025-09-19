import { requireAuthServerSession } from "@/lib/authServerSession";
import { Paper, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import React from "react";

type Variants = "reservation" | "user" | "group" | "family" | "import";
export default async function CreatePageTabs({
  active,
  children,
}: {
  active: Variants;
  children: React.ReactNode;
}) {
  const user = await requireAuthServerSession();

  return (
    <React.Fragment>
      <Tabs value={active} variant="scrollable">
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
        {user.role === "admin" && (
          <Tab
            value="import"
            label="Importovat uživatele"
            component={Link}
            href={`/create/import`}
          />
        )}
      </Tabs>
      <Paper className="p-2">{children}</Paper>
    </React.Fragment>
  );
}
