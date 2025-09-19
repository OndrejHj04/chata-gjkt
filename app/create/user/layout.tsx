import React from "react";
import CreatePageTabs from "../components/Tabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CreatePageTabs active="user">{children}</CreatePageTabs>;
}
