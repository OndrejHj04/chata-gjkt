import { getUserDetail } from "@/api/users/show";
import UserDetailDisplay from "./components/UserDetailDisplay";
import UserDetailForm from "./components/UserDetailForm";
import { getAuthServerSession } from "@/lib/authServerSession";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";

export default async function UserDetailPage(props: ServerSideComponentProp) {
  const { id } = await props.params;

  const data = await getUserDetail(id);
  const user = await getAuthServerSession();

  const editable =
    user.role !== "veřejnost" ||
    data.parent_id === user.id ||
    user.id === data.id;

  if (editable) {
    return <UserDetailForm userDetail={data} />;
  }
  return <UserDetailDisplay userDetail={data} />;
}
