"use client";
import {
  Autocomplete,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { createNewGroup } from "@/lib/api";
import { useRouter } from "next/navigation";
import { withToast } from "@/utils/toast/withToast";

export default function GroupNewForm({
  options,
  user,
}: {
  options: any;
  user: any;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      owner: options.find((item: any) => item.id === user.id),
    },
  });
  const isAdmin = user.role.id !== 3;
  const { push, refresh } = useRouter();

  const onSubmit = async (data: any) => {
    reset(data);
    withToast(
      createNewGroup({
        ...data,
        owner: data.owner.id,
      }),
      {
        message: "group.create",
        onSuccess: () => {
          push("/group/list");
          refresh();
        },
      }
    );
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between gap-2 mb-2">
        <Typography variant="h5">Nová skupina</Typography>
        <Button
          type="submit"
          variant="outlined"
          size="small"
          disabled={!isValid || !isDirty}
        >
          Uložit
        </Button>
      </div>
      <Paper className="p-2">
        <div className="flex-col flex gap-3 max-w-[320px]">
          <TextField
            label="Název skupiny"
            {...register("name", { required: true })}
          />
          <TextField
            label="Popis"
            className="col-span-2"
            {...register("description", { required: true })}
          />
          <Controller
            control={control}
            {...register("owner", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                fullWidth
                disabled={!isAdmin}
                value={value}
                onChange={(_, value) => {
                  onChange(value);
                }}
                options={options}
                getOptionLabel={(option: any) => option.name}
                renderOption={(props: any, option: any) => (
                  <li {...props}>
                    <span className="flex justify-between w-full">
                      <Typography>{option.name}</Typography>
                      <Typography color="text.secondary">
                        {option.email}
                      </Typography>
                    </span>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Majitel skupiny"
                    helperText="Majitel skupiny bude automaticky přídán do skupiny a může poté spravovat její členy."
                  />
                )}
              />
            )}
          />
        </div>
      </Paper>
    </form>
  );
}
