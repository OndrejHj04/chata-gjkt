"use client"

import { approveUserInReservation } from "@/lib/api"
import { withToast } from "@/utils/toast/withToast"
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"

export default function UserApproveButton({ userId, reservationId }: { userId: any, reservationId: any }) {
  const { refresh } = useRouter()

  const handleApprove = () => {
    withToast(approveUserInReservation({ userId, reservationId }), {message: "reservation.user.approve"})
    refresh()
  }

  return (
    <Button onClick={handleApprove} variant="text" size="small" color="success">Potvrdit</Button>
  )
}
