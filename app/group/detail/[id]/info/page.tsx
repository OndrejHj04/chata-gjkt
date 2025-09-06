import GroupDetailDisplay from "../components/GroupDetailDisplay";
import GroupDetailForm from "../components/GroupDetailForm";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { getAuthServerSession } from "@/lib/authServerSession";
import { getGroupDetail } from "@/api/group/show";

export default async function GroupDetailPage(props: ServerSideComponentProp) {
  const { id } = await props.params;
  const data = await getGroupDetail(id);
  
  const user = await getAuthServerSession();

  const editable = true;

  //user.role === "veřejnost"
  if (editable) {
    return <GroupDetailForm groupDetail={data} />;
  }
  return <GroupDetailDisplay groupDetail={data} />;
}
