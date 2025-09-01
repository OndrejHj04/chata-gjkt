"use client";
import handleExport from "@/lib/handleExport";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { exportReservationList, exportUserList } from "@/lib/api";

const exportEntities = {
  users: {
    name: 'Uživatelé',
    method: exportUserList
  },
  reservations: {
    name: 'Rezervace',
    method: exportReservationList
  }
}

export default function ExportButton({
  entity,
}: {
  entity: 'users' | 'reservations'
}) {
  const { data } = useSession()
  const roleId = data?.user.role.id

  const makeExport = async () => {
    const blob = await exportEntities[entity].method()

    handleExport(blob, exportEntities[entity].name + ".xlsx");
  };

  return (
    <Button variant="outlined" size="small" onClick={makeExport} disabled={roleId === 3}>
      Export
    </Button>
  );
}
