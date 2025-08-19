import SearchBar from "@/ui-components/SearchBar";
import { Button, Paper, Tab, Tabs } from "@mui/material";
import Link from "next/link";
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
            href="/photogallery/albums/list"
          />
        </Tabs>
      </div>
      <div className="flex gap-2 h-full">
        <Paper className="flex-1 h-full p-2">{children}</Paper>
        <Paper className="flex flex-col p-2 w-60 gap-2">
          <Link href={"/photogallery/albums/create"}>
            <Button variant="contained">Vytvořit album a přidat fotky</Button>
          </Link>
          <SearchBar variant="standard" label="Hledat alba" />
          <AlbumVisibilityFilterSelect />
        </Paper>
      </div>
    </div>
  );
}
