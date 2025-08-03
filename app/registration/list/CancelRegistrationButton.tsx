"use client"

import { cancelRegistration } from "@/lib/api"
import { withToast } from "@/utils/toast/withToast"
import { Button, CircularProgress } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CancelRegistrationButton({ formId }: { formId: any }) {
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()

  const handleCancel = () => {
    setLoading(true)
    withToast(cancelRegistration({ formId }), {message: "reservation.registration.cancel"})
    refresh()
  }

  return (
    <div className="flex items-center justify-end">
      {loading && <CircularProgress size={24} />}
      <Button disabled={loading} size="small" color="error" onClick={handleCancel}>Ukončit registrace</Button>
    </div>
  )
}
