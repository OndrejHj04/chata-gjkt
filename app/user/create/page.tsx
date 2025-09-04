import { getServerSession } from "next-auth";
import CreateUserForm from "./CreateUserForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getAuthServerSession } from "@/lib/authServerSession";

export default async function UserCreate() {
  const user = await getAuthServerSession()
  const role = user.role

  return <CreateUserForm role={role} />
}
