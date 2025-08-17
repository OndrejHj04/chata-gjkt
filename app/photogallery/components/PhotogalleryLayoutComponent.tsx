import SearchBar from "@/ui-components/SearchBar";
import { Paper, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import CreateAlbumButton from "./CreateAlbumButton";
import AlbumVisibilityFilterSelect from "./AlbumVisibilityFilterSelect";

export default function PhotogalleryLayoutComponent({
  children,
  variant,
}: {
  children: any;
  variant: "albums" | "photo-feed" | "my-photos";
}) {
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
        {variant !== "photo-feed" && (
          <SearchBar
            variant="standard"
            label="Hledat alba"
            className="md:w-80 w-40"
          />
        )}
        <div className="flex-1 flex justify-end items-center gap-2">
          {variant === "my-photos" && <AlbumVisibilityFilterSelect />}
          {variant === "my-photos" && <CreateAlbumButton />}
        </div>
      </div>
      <Paper className="w-full h-full p-2">{children}</Paper>
    </div>
  );
}
