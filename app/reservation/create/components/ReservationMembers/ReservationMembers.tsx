import ReservationMembersRender from "./ReservationMembersRender";
import { getUserFamily } from "@/lib/api";
import { getGroupList } from "@/api/group/index";
import { getAuthServerSession } from "@/lib/authServerSession";

export default async function ReservationMembers() {
  const user = await getAuthServerSession();
  const { data } = await getGroupList({
    owner: user.id.toString(),
  });
  const { data: family } = await getUserFamily({ userId: user.id });

  return <ReservationMembersRender groups={data} family={family} />;
}
