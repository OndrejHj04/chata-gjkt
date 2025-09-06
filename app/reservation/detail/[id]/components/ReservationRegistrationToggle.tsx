"use client"

import { allowReservationSignIn, cancelRegistration } from "@/lib/api"
import ToastManager from "@/utils/toast/ToastManager"
import { withToast } from "@/utils/toast/withToast"
import { ContentCopy } from "@mui/icons-material"
import {
  CircularProgress, FormControlLabel, IconButton, Switch, Tooltip, Typography
} from "@mui/material"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function ReservationRegistrationToggle({ reservation, disabled, conflicts }: { reservation: any, disabled: any, conflicts: any }) {
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const on = reservation.form_id && reservation.form_public_url

  const handleToggle = (e: any) => {
    setLoading(true)

    if (e.target.checked) {
        withToast(allowReservationSignIn({ reservation }), {message: "reservation.registration.toggle.allow", onSuccess: () => {
        setLoading(false)
        refresh()
      }})
    } else {
      withToast(cancelRegistration({ formId: reservation.form_id }), {message: "reservation.registration.toggle.cancel", onSuccess: () => {
        setLoading(false)
        refresh()
      }})
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reservation.form_public_url)
    ToastManager.show("reservation.registration.formLink.copy.success")
  }

  return (
    <div className="flex items-center gap-2 justify-between">
      {loading ? <div className="flex gap-2">
        <Typography variant="h5">Registrace se načítá</Typography>
        <CircularProgress size={30} />
      </div> : on ? <div className="flex gap-2">
        <Typography variant="h5">Registrace běží, formulář je k dispozici zde: </Typography>
        <IconButton size="small" onClick={copyToClipboard}>
          <ContentCopy />
        </IconButton>
      </div> : <div>
        <Typography variant="h5">Registrace vypnuta</Typography>
      </div>
      }
      <Tooltip {...(!conflicts && { disableFocusListener: true, disableHoverListener: true, disableTouchListener: true })} title="Registrace nelze ukončit dokud nejsou vyřešené všechny konflikty">
        <FormControlLabel control={<Switch disabled={loading || disabled || conflicts} checked={on} />} onChange={handleToggle} label="Zapnutá registrace" />
      </Tooltip>
    </div >
  )
}
