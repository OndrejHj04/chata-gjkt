import { Tab, Tabs } from "@mui/material";
import Link from "next/link";

export default function Layout({ children }: any) {
  return (
    <div className="w-full h-full flex flex-col px-2">
      <div className="flex items-center">
        <Tabs value={"news"} variant="scrollable" className="flex-1">
          <Tab
            value="settings"
            label="Nastavení"
            component={Link}
            href="/settings"
          />
          <Tab
            value="news"
            label="Zprávy z chaty"
            component={Link}
            href="/settings/news"
          />
        </Tabs>
      </div>
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
