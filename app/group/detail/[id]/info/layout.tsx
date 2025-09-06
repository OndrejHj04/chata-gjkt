import { Paper, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function GroupDetailLayout({ params, children }: { params: any, children: any }) {
  const { id } = params

  return (
    <React.Fragment>
      <Tabs value={"info"} variant="scrollable">
        <Tab value="info" label="Základní informace" component={Link} href={`/group/detail/${id}/info`} />
        <Tab value="users" label="Uživatelé" component={Link} href={`/group/detail/${id}/users`} />
        <Tab value="reservations" label="Rezervace" component={Link} href={`/group/detail/${id}/reservations`} />
      </Tabs>
      <Paper className="p-2">
        {children}
      </Paper>
    </React.Fragment>
  )
}
