"use client";

import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Button,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
} from "@mui/material";
import { Icon } from "@mui/material";
import Link from "next/link";
import ReservationModal from "./ReservationModal";
import { Cancel, CheckCircle } from "@mui/icons-material";
import React, { useState } from "react";
import { reservationDelete } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { dayjsExtended } from "@/lib/dayjsExtended";
import { withToast } from "@/utils/toast/withToast";

export default function ReservationListItem({
  reservation,
  isAdmin,
  userId,
}: {
  reservation: any;
  isAdmin: any;
  userId: any;
}) {
  const searchParams = useSearchParams()
  const reservation_id = searchParams.get('reservation_id')
  const { refresh } = useRouter();
  const blocation = reservation.status_id === 5;
  const [selectedReservation, setSelectedReservation] = useState<{ mouseX: number, mouseY: number, id: number } | null>(null)

  const handleDeleteReservations = () => {
    withToast(reservationDelete({ reservationId: reservation.id }), {message: "reservation.delete"})
    refresh();
  };

  const isSelected = selectedReservation !== null && selectedReservation.id === reservation.id;

  const setMenuPosition = (e: any) => {
    const allowMenu = isAdmin || userId === reservation.leader_id;
    if (isSelected || !allowMenu) {
      setSelectedReservation(null);
    } else {
      setSelectedReservation({
        mouseX: e.clientX + 2,
        mouseY: e.clientY - 6,
        id: reservation.id,
      });
    }
  };

  return (
    <React.Fragment>
      {isAdmin && Number(reservation_id) === reservation.id && (
        <ReservationModal reservation={reservation} />
      )}
      <TableRow
        selected={isSelected}
        onClick={setMenuPosition}
        className="[&_.MuiTableCell-root]:px-1"
      >
        <TableCell>{reservation.name}</TableCell>
        <TableCell>
          {dayjsExtended(reservation.creation_date).format("DD. MMMM")}
        </TableCell>
        <TableCell>
          {dayjsExtended(reservation.from_date).format("DD. MMMM")}
        </TableCell>
        <TableCell>
          {dayjsExtended(reservation.to_date).format("DD. MMMM")}
        </TableCell>
        <TableCell>{reservation.users_count}</TableCell>
        <TableCell>
          <div className="flex items-center">
            {reservation.active_registration ? (
              <CheckCircle color="success" sx={{ width: 32, height: 32 }} />
            ) : (
              <Cancel color="error" sx={{ width: 32, height: 32 }} />
            )}
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2">
            {reservation.leader_name && (
              <React.Fragment>
                <AvatarWrapper data={{ image: reservation.leader_image }} />
                {reservation.leader_name}
              </React.Fragment>
            )}
          </div>
        </TableCell>
        <TableCell>{reservation.beds_count}</TableCell>

        <TableCell>
          <Button
            className="!normal-case !text-inherit"
            onClick={(e) => e.stopPropagation()}
            {...(isAdmin &&
              !blocation && {
              component: Link,
              href: {
                href: "/reservation/list",
                query: { ...searchParams, reservation_id: reservation.id },
              },
            })}
          >
            <Icon sx={{ color: reservation.status_color }} className="mr-2">
              {reservation.status_icon}
            </Icon>
            {reservation.status_name}
          </Button>
        </TableCell>
        <TableCell align="right" className="w-[150px]">
          {!blocation && !!reservation.detail && (
            <Link
              href={`/reservation/detail/${reservation.id}/info`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button>detail</Button>
            </Link>
          )}
        </TableCell>
      </TableRow>
      <Menu
        open={isSelected}
        onClose={() => setSelectedReservation(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          selectedReservation !== null
            ? {
              top: selectedReservation.mouseY,
              left: selectedReservation.mouseX,
            }
            : undefined
        }
      >
        {reservation.active_registration ? (
          <MenuItem disabled>
            Nelze odstranit dokud je spuštěná registrace
          </MenuItem>
        ) : (
          <MenuItem onClick={handleDeleteReservations}>
            Odstranit rezervaci
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
