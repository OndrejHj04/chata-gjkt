import { Button, Paper, Tab, Tabs } from "@mui/material";
import AlbumVisibilityFilterSelect from "../../components/AlbumVisibilityFilterSelect";
import Link from "next/link";
import SearchBar from "@/ui-components/SearchBar";

export default function Layout({ children }: any) {
  return (
    <div className="w-full h-full flex flex-col px-2">
      <div className="flex items-center">
        <Tabs value={"albums"} variant="scrollable" className="flex-1">
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
