"use client"

import { editUserDetail } from "@/lib/api"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { withToast } from "@/utils/toast/withToast"
import { Alert, Button, CardHeader, List, ListItem, ListItemButton, ListItemText, MenuItem, Modal, TextField, Typography } from "@mui/material"
import dayjs from "dayjs"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import ChangeProfilePictureModal from "./ChangeProfilePictureModal"

export default function UserDetailForm({ userDetail }: { userDetail: any }) {
  const [profileImageModal, setProfileImageModal] = useState(false)

  const { handleSubmit, register, reset, formState: { isValid, isDirty } } = useForm({
    defaultValues: {
      ID_code: userDetail.ID_code,
      adress: userDetail.adress,
      organization: userDetail.organization_id
    }
  })

  const onSubmit = (data: any) => {
    withToast(editUserDetail({ userId: userDetail.id, ID_code: data.ID_code, adress: data.adress, organization: data.organization }),  {message: "user.detail.update" , onSuccess: () => {
      reset(data)
    }})
  }

  return (
    <div>
      <ChangeProfilePictureModal open={profileImageModal} setOpen={setProfileImageModal} />
      <CardHeader
        className="!p-0"
        avatar={<AvatarWrapper data={{ image: userDetail.image }} size={56} />}
        title={
          <Typography variant="h5">
            {userDetail.name}
          </Typography>
        }
        subheader={userDetail.email}
      />
      <List className="w-fit">
        <ListItem disablePadding>
          <ListItemText>Role: {userDetail.role}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Datum narození: {dayjs(userDetail.birth_date).format("DD. MMMM YYYY")}</ListItemText>
        </ListItem>
      </List>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-[300px]">
        <Button variant="outlined" onClick={()=>setProfileImageModal(true)}>Změnit profilový obrázek</Button>
        {!!userDetail.parent_id && <Alert severity="info">Rodinný účet uživatele: {userDetail.parent_name}.</Alert>}
        {!!userDetail.children && <Alert severity="info">Správce rodinných účtů.</Alert>}
        <TextField label="Číslo OP" {...register("ID_code", { required: true })} />
        <TextField label="Adresa" {...register("adress", { required: true })} />
        <TextField select {...register("organization")} defaultValue={userDetail.organization_id} label="Organizace">
          <MenuItem value={1}>ZO</MenuItem>
          <MenuItem value={2}>Zaměstnanec</MenuItem>
          <MenuItem value={3}>Veřejnost</MenuItem>
        </TextField>
        <Button variant="outlined" type="submit" disabled={!isValid || !isDirty}>Uložit</Button>
      </form>
    </div>
  )
}
