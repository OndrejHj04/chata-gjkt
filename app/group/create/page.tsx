import GroupNewForm from "./GroupNewForm";
import { getUsersBySearch } from "@/lib/api";
import { requireAuthServerSession } from "@/lib/authServerSession";

export default async function CreateGroupForm() {
  const { data } = await getUsersBySearch();
  const user = await requireAuthServerSession()

  return <GroupNewForm options={data} user={user} />;
}
