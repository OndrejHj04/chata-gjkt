"use client";
import { createUserAccount } from "@/lib/api";
import { Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { withToast } from "@/utils/toast/withToast";
import { useRouter } from "next/navigation";
import { Role } from "@/constants/role";

export default function CreateUserForm({ role }: { role: Role["name"] }) {
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    reset,
  } = useForm();
  const { refresh, push } = useRouter();

  const onSubmit = async (data: any) => {
    reset(data);
    withToast(createUserAccount(data), { message: "user.create" });
    push("/user/list");
    refresh();
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex justify-between gap-2">
        <Typography variant="h5">Vytvořit uživatele</Typography>
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
        <div className="flex flex-col max-w-[320px] gap-3">
          <TextField
            label="Jméno"
            {...register("first_name", { required: true })}
          />
          <TextField
            label="Příjmení"
            {...register("last_name", { required: true })}
          />
          <TextField
            label="Email"
            {...register("email", {
              required: true,
              pattern: {
                value: /@/,
                message: "Neplatný email",
              },
            })}
          />
          <TextField
            {...register("role", { required: true })}
            select
            label="Role"
          >
            {Role.getAllRoles().map(({ name }) => (
              <MenuItem
                key={name}
                disabled={role === "uživatel" && name === "admin"}
                value={name}
              >
                {name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </Paper>
    </form>
  );
}
