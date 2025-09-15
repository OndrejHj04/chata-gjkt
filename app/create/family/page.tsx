import CreateFamilyAccountForm from "./components/FamilyAccountForm";
import { requireAuthServerSession } from "@/lib/authServerSession";

export default async function CreateFamilyAccount() {
  const user = await requireAuthServerSession()

  return <CreateFamilyAccountForm user={user} />
}
