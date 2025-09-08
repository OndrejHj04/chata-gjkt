import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SideMenuButton from "./sComponents/SideMenuButton";
import Link from "next/link";
import TopBarUserCard from "./sComponents/UserCardMenu";
import DarkModeToggle from "./sComponents/DarkModeToggle";
import ToggleFullscreen from "./sComponents/ToggleFullscreen";
import { getUserTheme } from "@/api/theme/show";

export default async function TopBar() {
  const data = await getServerSession(authOptions);
  const theme = await getUserTheme();

  return (
    <AppBar position="static" className="h-[52px]">
      <Toolbar className="!min-h-0 !p-0 !pl-2 flex my-auto">
        <div className="flex-1 flex justify-start items-center">
          <SideMenuButton disabled={Boolean(!data?.user)} />
          <Typography
            variant="h6"
            component={Link}
            href="/"
            className="text-inherit no-underline"
          >
            Chata GJKT
          </Typography>
        </div>
        {data?.user && (
          <div className="flex-1 flex justify-end">
            <ToggleFullscreen />
            <DarkModeToggle theme={theme} />
            <TopBarUserCard />
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
