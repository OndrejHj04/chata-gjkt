"use client";

import { storeNews } from "@/api/news/store";
import { withToast } from "@/utils/toast/withToast";
import { Button, FormControlLabel, Switch, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type NewsFormType = {
  title: string;
  content: string;
  send_email: boolean;
};

export default function NewsForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
    reset
  } = useForm<NewsFormType>({
    defaultValues: {
      content: "",
      title: "",
      send_email: false,
    },
  });

  const onSubmit: SubmitHandler<NewsFormType> = (data) => {
    withToast(storeNews(data), { message: "news.create" });
    reset()
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <TextField
        {...register("title", { required: true, maxLength: 60 })}
        label="Název"
      />
      <TextField
        {...register("content", { required: true, maxLength: 360 })}
        label="Obsah"
        multiline
        maxRows={5}
        minRows={5}
      />
      <Controller
        {...register("send_email")}
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <FormControlLabel
              control={<Switch checked={value} />}
              onChange={(_, value) => {
                onChange(value);
              }}
              label="Odeslat emailové upozornění"
            />
          );
        }}
      />
      <Button type="submit" disabled={!isValid} variant="contained">
        Uložit
      </Button>
    </form>
  );
}
