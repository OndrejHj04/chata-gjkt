import GroupDetailDisplay from "../components/GroupDetailDisplay";
import GroupDetailForm from "../components/GroupDetailForm";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { getGroupDetail } from "@/api/group/show";
import { requireAuthServerSession } from "@/lib/authServerSession";

export default async function GroupDetailPage(props: ServerSideComponentProp) {
  const { id } = await props.params;
  const data = await getGroupDetail(id);
  const user = await requireAuthServerSession()

  const editable = user.role === "admin" || data.owner_id === user.id

  if (editable) {
    return <GroupDetailForm groupDetail={data} />;
  }
  return <GroupDetailDisplay groupDetail={data} />;
}
