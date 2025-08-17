import { Paper, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import CreateAlbumButton from "../filters/CreateAlbumButton";

export default async function Layout({ params, children }: any) {
  const { variant } = await params;
  return (
    <div className="w-full h-full flex flex-col px-2">
      <div className="flex items-center">
        <Tabs value={variant} variant="scrollable" className="flex-1">
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
        <div>
          asdf
        </div>
        <div className="flex-1 flex justify-end">
          <CreateAlbumButton />
        </div>
      </div>
      <Paper className="w-full h-full p-2">{children}</Paper>
    </div>
  );
}
