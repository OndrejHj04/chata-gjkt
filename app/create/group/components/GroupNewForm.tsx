"use client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { withToast } from "@/utils/toast/withToast";
import { createNewGroup } from "@/api/group/store";

export default function GroupNewForm() {
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { push, refresh } = useRouter();

  const onSubmit = async (data: any) => {
    reset(data);
    withToast(createNewGroup(data), {
      message: "group.create",
      onSuccess: () => {
        push("/group/list");
        refresh();
      },
    });
  };

  return (
    <form className="flex flex-col gap-2 max-w-[400px]" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Název skupiny"
        {...register("name", { required: true })}
      />
      <TextField
        label="Popis"
        className="col-span-2"
        {...register("description", { required: true })}
      />
      <Button
        type="submit"
        variant="outlined"
        size="small"
        disabled={!isValid || !isDirty}
      >
        Uložit
      </Button>
    </form>
  );
}
