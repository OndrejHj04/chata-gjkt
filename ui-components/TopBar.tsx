import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SideMenuButton from "./sComponents/SideMenuButton";
import Link from "next/link";
import TopBarUserCard from "./sComponents/UserCardMenu";
import DarkModeToggle from "./sComponents/DarkModeToggle";
import ToggleFullscreen from "./sComponents/ToggleFullscreen";
import { getUserTheme } from "@/api/theme/show";
import { getAuthServerSession } from "@/lib/authServerSession";
import { getNewsList } from "@/api/news/index";
import NotificationsButton from "./sComponents/NotificationsButton";

export default async function TopBar() {
  const user = await getAuthServerSession();
  const theme = await getUserTheme();

  const { data, count } = await getNewsList({ user: user?.id.toString() });

  return (
    <AppBar position="static" className="h-[52px]">
      <Toolbar className="!min-h-0 !p-0 !pl-2 flex my-auto">
        <div className="flex-1 flex justify-start items-center">
          <SideMenuButton disabled={Boolean(!user)} />
          <Typography
            variant="h6"
            component={Link}
            href="/"
            className="text-inherit no-underline"
          >
            Chata GJKT
          </Typography>
        </div>
        {user && (
          <div className="flex-1 flex justify-end">
            <NotificationsButton count={count} />
            <ToggleFullscreen />
            <DarkModeToggle theme={theme} />
            <TopBarUserCard />
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
