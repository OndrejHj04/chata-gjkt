"use client";
import { createUserAccount } from "@/lib/api";
import { Button, MenuItem, TextField } from "@mui/material";
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
    <form
      className="flex flex-col gap-2 w-[400px]"
      onSubmit={handleSubmit(onSubmit)}
    >
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
      <TextField {...register("role", { required: true })} select label="Role">
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
