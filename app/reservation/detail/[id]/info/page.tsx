import React from "react";
import ReservationDetailForm from "../components/ReservationDetailForm";
import ReservationDetailDisplay from "../components/ReservationDetailDisplay";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { requireAuthServerSession } from "@/lib/authServerSession";
import { getReservationDetail } from "@/api/reservations/show";

export default async function ReservationDetailPage(
  props: ServerSideComponentProp
) {
  const { id } = await props.params;
  const user = await requireAuthServerSession()

  const data = await getReservationDetail(id);
  const isAdmin = user.role === "admin";
  const isLeader = data.leader_id === user.id;

  if (isAdmin || isLeader) {
    return <ReservationDetailForm reservationDetail={data} isAdmin={isAdmin} />;
  }
  return <ReservationDetailDisplay reservationDetail={data} />;
}
