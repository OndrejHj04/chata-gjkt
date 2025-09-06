import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { getEmailSettings } from "@/lib/api";
import MailingToggle from "../components/mailingToggle";

export default async function Layout({ children }: any) {
  const { allowEmails } = await getEmailSettings();

  return (
    <div>
      <div className="flex justify-between items">
        <Tabs value={"templates"} variant="scrollable">
          <Tab
            value="send"
            label="Odesláno"
            component={Link}
            href="/mailing/send"
          />
          <Tab
            value="templates"
            label="Šablony"
            component={Link}
            href="/mailing/templates"
          />
          <Tab
            value="events"
            label="Události"
            component={Link}
            href="/mailing/events"
          />
        </Tabs>
        <MailingToggle allowMails={allowEmails} />
      </div>
      {children}
    </div>
  );
}
