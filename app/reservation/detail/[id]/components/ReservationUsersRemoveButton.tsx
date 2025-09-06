"use client"

import { reservationDeleteUser } from "@/lib/api"
import { withToast } from "@/utils/toast/withToast"
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"

export default function ReservationUsersRemoveButton({ reservationId, userId }: { reservationId: any, userId: any }) {
  const { refresh } = useRouter()
  const handleRemoveUserFromReservation = () => {
    withToast(reservationDeleteUser({ userId, reservationId }), {message: "reservation.user.remove"})
    refresh()
  }

  return (
    <Button size="small" variant="text" color="error" onClick={handleRemoveUserFromReservation}>Odstranit uživatele</Button>
  )
}
