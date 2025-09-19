import { Paper } from "@mui/material";
import PasswordResetForm from "./components/PasswordResetForm";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { redirect } from "next/navigation";

export default async function ResetPasswordForm(
  props: ServerSideComponentProp
) {
  const { userId } = await props.searchParams;

  if (!userId) redirect("/");

  return (
    <Paper className="p-2 flex flex-col w-full max-w-[300px]">
      <PasswordResetForm userId={userId} />
    </Paper>
  );
}
