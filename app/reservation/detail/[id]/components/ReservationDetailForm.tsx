"use client";

import { Room } from "@/constants/room";
import {
  editReservationDate,
  editReservationDetail,
  editReservationRooms,
  editReservationStatus,
} from "@/lib/api";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import ToastManager from "@/utils/toast/ToastManager";
import { withToast } from "@/utils/toast/withToast";
import {
  Button,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";
import { Controller, useForm } from "react-hook-form";

export default function ReservationDetailForm({
  reservationDetail,
  isAdmin,
}: {
  reservationDetail: any;
  isAdmin: any;
}) {
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, isDirty, dirtyFields },
    reset,
  } = useForm({
    defaultValues: {
      name: reservationDetail.name || "",
      purpouse: reservationDetail.purpouse || "",
      instructions: reservationDetail.instructions || "",
      from_date: dayjs(reservationDetail.from_date) || "",
      to_date: dayjs(reservationDetail.to_date) || "",
      status: reservationDetail.status_id || "",
      paymentSymbol: reservationDetail.payment_symbol || "",
      rejectReason: reservationDetail.reject_reason || "",
      successLink: reservationDetail.success_link || "",
      rooms: reservationDetail.rooms,
    },
  });

  const onSubmit = (data: any) => {
    if (dirtyFields.from_date || dirtyFields.to_date) {
      withToast(
        editReservationDate({
          reservationId: reservationDetail.id,
          from_date: data.from_date,
          to_date: data.to_date,
        }),
        {
          message: "reservation.detail.date.update",
          onSuccess: () =>
            reset({
              ...data,
              status: data.status === 4 || data.status === 3 ? 2 : data.status,
            }),
        }
      );
    }

    if (dirtyFields.rooms) {
      withToast(
        editReservationRooms({
          reservationId: reservationDetail.id,
          rooms: data.rooms,
        }),
        {
          message: "reservation.detail.rooms.update",
          onSuccess: () => reset(data),
        }
      );
    }

    if (
      Object.keys(dirtyFields).filter(
        (item: any) =>
          item !== "from_date" &&
          item !== "to_date" &&
          item !== "status" &&
          item !== "rooms"
      ).length
    ) {
      withToast(
        editReservationDetail({
          reservationId: reservationDetail.id,
          name: data.name,
          instructions: data.instructions,
          purpouse: data.purpouse,
          paymentSymbol: data.paymentSymbol,
          successLink: data.successLink,
          rejectReason: data.rejectReason,
        }),
        {
          message: "reservation.detail.info.update",
          onSuccess: () => reset(data),
        }
      );
    }

    if (dirtyFields.status) {
      editReservationStatus({
        reservationId: reservationDetail.id,
        newStatus: data.status,
      }).then(({ success, symbol, reject, link }) => {
        if (success) ToastManager.show("reservation.detail.status.update.success")
        else ToastManager.show("reservation.detail.status.update.error")
        reset({
          ...data,
          paymentSymbol: symbol || "",
          rejectReason: reject || "",
          successLink: link || "",
          status: data.status,
        });
      });
    }
  };

  return (
    <React.Fragment>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-2 grid grid-cols-2 max-w-[420px] gap-3"
      >
        <div className="col-span-2">
          {reservationDetail.leader_name ? (
            <React.Fragment>
              <Typography variant="h5">Vedoucí rezervace</Typography>
              <CardHeader
                className="!p-0"
                avatar={
                  <AvatarWrapper
                    data={{ image: reservationDetail.leader_image }}
                    size={56}
                  />
                }room
                title={
                  <Typography variant="h5">
                    {reservationDetail.leader_name}
                  </Typography>
                }
                subheader={reservationDetail.leader_email}
              />
            </React.Fragment>
          ) : (
            <Typography variant="h5">
              Vedoucí rezervace: neznámý uživatel
            </Typography>
          )}
        </div>
        <TextField label="Název" {...register("name")} className="col-span-2" />
        <Controller
          control={control}
          name="from_date"
          render={({ field }) => (
            <DatePicker {...field} label="Začátek" format="DD. MMMM YYYY" />
          )}
        />
        <Controller
          control={control}
          name="to_date"
          render={({ field }) => (
            <DatePicker {...field} label="Začátek" format="DD. MMMM YYYY" />
          )}
        />
        <TextField
          label="Pokyny pro účastníky"
          {...register("instructions")}
          className="col-span-2"
        />
        <TextField label="Důvod rezervace" {...register("purpouse")} />
        <Controller
          control={control}
          name="paymentSymbol"
          render={({ field }) => (
            <TextField
              {...field}
              disabled={!isAdmin}
              label="Variabilní symbol pro platbu"
            />
          )}
        />
        <Controller
          control={control}
          name="successLink"
          render={({ field }) => (
            <TextField
              {...field}
              disabled={!isAdmin}
              label="Odkaz na web Pece pod Sněžkou"
            />
          )}
        />
        <Controller
          control={control}
          name="rejectReason"
          render={({ field }) => (
            <TextField {...field} disabled={!isAdmin} label="Důvod zamítnutí" />
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <TextField
              {...field}
              disabled={!isAdmin}
              select
              label="Status"
              className="col-span-2"
            >
              <MenuItem value={2}>Čeká na potvrzení</MenuItem>
              <MenuItem value={3}>Potvrzeno</MenuItem>
              <MenuItem value={4}>Zamítnuto</MenuItem>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="rooms"
          render={({ field }) => (
            <FormControl className="col-span-2">
              <InputLabel id="rooms-label">Pokoje</InputLabel>
              <Select
                {...field}
                labelId="rooms-label"
                multiple
                id="rooms"
                label="Label"
              >
                {Room.getAllRooms().map((room) => (
                  <MenuItem key={room.id} value={room.name}>
                    {room.name}; {room.capacity} osoby
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Button
          variant="outlined"
          type="submit"
          disabled={!isValid || !isDirty}
          className="col-span-2"
        >
          Uložit
        </Button>
      </form>
    </React.Fragment>
  );
}
