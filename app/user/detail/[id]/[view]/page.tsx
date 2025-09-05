import { getUserDetail } from "@/api/users/show"
import UserDetailDisplay from "./components/UserDetailDisplay"
import UserDetailForm from "./components/UserDetailForm"
import UserGroupsTable from "./components/UserGroupsTable"
import UserReservationsTable from "./components/UserReservationsTable"
import { getAuthServerSession } from "@/lib/authServerSession"
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps"

export default async function UserDetailPage(props: ServerSideComponentProp) {
  const { page } = await props.searchParams
  const { view, id } = await props.params
  
  const data = await getUserDetail(id)
  const user = await getAuthServerSession()

  const editable = user.role !== 'veřejnost' || data.parent_id === user.id || user.id === data.id

  if (view === "info") {
    if (editable) {
      return <UserDetailForm userDetail={data} />
    }
    return <UserDetailDisplay userDetail={data} />
  }
  if (view === "groups") {
    return <UserGroupsTable id={id} page={page} />
  }
  if (view === "reservations") {
    return <UserReservationsTable id={id} page={page} />
  }

  return null

}
