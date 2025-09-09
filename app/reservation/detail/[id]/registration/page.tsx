import React from "react";
import { Divider } from "@mui/material";
import ReservationRegistration from "../components/ReservationRegistration";
import ReservationRegistrationCustom from "../components/ReservationRegistrationCustom";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { requireAuthServerSession } from "@/lib/authServerSession";
import { getReservationDetail } from "@/api/reservations/show";

export default async function ReservationDetailPage(
  props: ServerSideComponentProp
) {
  const { page } = await props.searchParams;
  const { id } = await props.params;

  const user = await requireAuthServerSession()

  const data = await getReservationDetail(id);
  const isAdmin = user.role !== "veřejnost";
  const isLeader = data.leader_id === user.id;
  const editable = data.status_id !== 1 && (isAdmin || isLeader);

  return (
    <React.Fragment>
      <ReservationRegistration id={id} page={page} />
      <Divider className="my-3" />
      {editable && <ReservationRegistrationCustom id={id} />}
    </React.Fragment>
  );
}
