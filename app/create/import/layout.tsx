import React from "react";
import CreatePageTabs from "../components/Tabs";
import { requireAuthServerSession } from "@/lib/authServerSession";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuthServerSession();
  if (user.role !== "admin") redirect("/");

  return <CreatePageTabs active="import">{children}</CreatePageTabs>;
}
