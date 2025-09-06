"use client"

import { deleteUser } from "@/lib/api"
import { withToast } from "@/utils/toast/withToast"
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"

export default function UserRejectButton({ userId, reservationId }: { userId: any, reservationId: any }) {
  const { refresh } = useRouter()

  const handleReject = () => {
    withToast(deleteUser({ userId, reservationId }), {message: "reservation.user.remove"})
    refresh()
  }

  return (
    <Button onClick={handleReject} variant="text" size="small" color="error">Zamítnout</Button>
  )
}
