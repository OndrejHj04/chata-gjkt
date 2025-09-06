import { Paper, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function ReservationDetailLayout({ params, children }: { params: any, children: any }) {
  const { id } = params

  return (
    <React.Fragment>
      <Tabs value={"info"} variant="scrollable">
        <Tab value="info" label="Základní informace" component={Link} href={`/reservation/detail/${id}/info`} />
        <Tab value="registration" label="Registrace" component={Link} href={`/reservation/detail/${id}/registration`} />
        <Tab value="users" label="Účastníci" component={Link} href={`/reservation/detail/${id}/users`} />
        <Tab value="groups" label="Skupiny" component={Link} href={`/reservation/detail/${id}/groups`} />
      </Tabs>
      <Paper className="p-2">
        {children}
      </Paper>
    </React.Fragment>
  )
}
