import CreateUserForm from "./CreateUserForm";
import { requireAuthServerSession } from "@/lib/authServerSession";

export default async function UserCreate() {
  const user = await requireAuthServerSession()
  const role = user.role

  return <CreateUserForm role={role} />
}
