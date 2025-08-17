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
  variant: "albums" | "feed" | "my-albums";
}) {
  return (
    <div className="w-full h-full flex flex-col px-2">
      <div className="flex items-center">
        <Tabs value={variant} variant="scrollable" className="flex-1">
          <Tab
            value="feed"
            label="Galerie"
            component={Link}
            href="/photogallery/feed"
          />
          <Tab
            value="albums"
            label="Alba"
            component={Link}
            href="/photogallery/albums"
          />
        </Tabs>
        {variant === "albums" && (
          <SearchBar
            variant="standard"
            label="Hledat alba"
            className="md:w-80 w-40"
          />
        )}
        <div className="flex-1 flex justify-end items-center gap-2">
          {variant === "albums" && <AlbumVisibilityFilterSelect />}
          {variant === "albums" && <CreateAlbumButton />}
        </div>
      </div>
      <Paper className="w-full h-full p-2">{children}</Paper>
    </div>
  );
}
