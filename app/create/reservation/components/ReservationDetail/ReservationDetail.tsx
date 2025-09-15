import ReservationDetailRender from "./ReservationDetailRender";
import { getUsersBySearch } from "@/lib/api";
import { requireAuthServerSession } from "@/lib/authServerSession";

export default async function ReservationDetail() {
  const user = await requireAuthServerSession()
  const { data } = await getUsersBySearch();

  return <ReservationDetailRender user={user} options={data} />;
}
