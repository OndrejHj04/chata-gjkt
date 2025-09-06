import React from "react";
import ReservationDetailForm from "../components/ReservationDetailForm";
import ReservationDetailDisplay from "../components/ReservationDetailDisplay";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { getAuthServerSession } from "@/lib/authServerSession";
import { getReservationDetail } from "@/api/reservations/show";

export default async function ReservationDetailPage(
  props: ServerSideComponentProp
) {
  const { id } = await props.params;
  const user = await getAuthServerSession();

  const data = await getReservationDetail(id);
  const isAdmin = user.role !== "veřejnost";
  const isLeader = data.leader_id === user.id;
  const editable = data.status_id !== 1 && (isAdmin || isLeader);

  if (editable) {
    return <ReservationDetailForm reservationDetail={data} isAdmin={isAdmin} />;
  }
  return <ReservationDetailDisplay reservationDetail={data} />;
}
