import { Paper, Tab, Tabs } from "@mui/material";
import Link from "next/link";

export default async function Layout({ params, children }: any) {
  const { variant } = await params;
  return (
    <div className="w-full h-full flex flex-col px-2">
      <div className="flex justify-between mb-1">
        <Tabs value={variant} variant="scrollable">
          <Tab
            value="my-photos"
            label="Moje fotky"
            component={Link}
            href="/photogallery/my-photos"
          />
          <Tab
            value="albums"
            label="Veřejná alba"
            component={Link}
            href="/photogallery/albums"
          />
          <Tab
            value="photo-feed"
            label="Přehled fotek"
            component={Link}
            href="/photogallery/photo-feed"
          />
        </Tabs>
      </div>
      <Paper className="w-full h-full p-2">{children}</Paper>
    </div>
  );
}
