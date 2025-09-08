import React from "react";
import SettingsForm from "./components/SettingsForm";
import { getSettings } from "@/api/settings/index";

export default async function Settings() {
  const data = await getSettings();

  return <SettingsForm data={data}/>
}
