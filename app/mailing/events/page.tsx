import { getMailingEventsList } from "@/lib/api";
import MailingEventsForm from "./MailingEventsForm";

export default async function Page() {
  const { data } = await getMailingEventsList();

  return <MailingEventsForm events={data} />;
}
