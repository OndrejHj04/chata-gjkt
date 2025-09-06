import { Paper, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function UserDetailLayout({ params, children }: { params: any, children: any }) {
  const { id } = params

  return (
    <React.Fragment>
      <Tabs value={"reservations"} variant="scrollable">
        <Tab value="info" label="Základní informace" component={Link} href={`/user/detail/${id}/info`} />
        <Tab value="groups" label="Skupiny" component={Link} href={`/user/detail/${id}/groups`} />
        <Tab value="reservations" label="Rezervace" component={Link} href={`/user/detail/${id}/reservations`} />
      </Tabs>
      <Paper className="p-2">
        {children}
      </Paper>
    </React.Fragment>
  )
}
