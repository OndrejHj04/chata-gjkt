"use client";

import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { createNewReservation } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import { ReservationContext } from "./layout";

export default function CreateButton() {
  const { createReservation, setCreateReservation } = useContext(ReservationContext);
  const { push, refresh } = useRouter()
  const [loading, setLoading] = useState(false);
  const { from_date, to_date, name, purpouse } = createReservation
  const isValid = from_date.length && to_date.length && name.length && purpouse.length
  const setDefault = () => {
    setCreateReservation({
      from_date: "",
      to_date: "",
      groups: [],
      rooms: [],
      leader: 0,
      purpouse: "",
      instructions: "",
      name: "",
      family: false
    });
  };
  const handleSubmit = () => {
    setLoading(true);
    withToast(createNewReservation({ ...createReservation }), {message: "reservation.create"})
    push("/reservation/list")
    refresh()
    setDefault()
  };

  return (
    <Button
      variant="outlined"
      type="submit"
      size="small"
      onClick={handleSubmit}
      disabled={!isValid || loading}
    >
      Uložit
    </Button>
  );
}