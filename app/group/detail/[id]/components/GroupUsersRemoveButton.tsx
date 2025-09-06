"use client"

import { groupDeleteUser } from "@/lib/api"
import { withToast } from "@/utils/toast/withToast"
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"

export default function GroupUsersRemoveButton({ groupId, userId }: { groupId: any, userId: any }) {
  const { refresh } = useRouter()
  const handleDeleteUserFromGroup = () => {
    withToast(groupDeleteUser({ userId, groupId }), {message: "group.user.remove"})
    refresh()
  }

  return (
    <Button size="small" color="error" onClick={handleDeleteUserFromGroup}>Odstranit uživatele</Button>
  )
}
