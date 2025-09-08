import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Link from "next/link";
import { Icon } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const actionMenu = [
  {
    href: "/reservation/create",
    title: "Vytvořit rezervaci",
    icon: "edit_calendar",
  },
  {
    href: "/group/create",
    title: "Vytvořit skupinu",
    icon: "group_add",
  },
  {
    href: "/user/import",
    title: "Importovat uživatele",
    icon: "import_export",
  },
  {
    href: "/user/create",
    title: "Vytvořit uživatele",
    icon: "person_add",
  },
  {
    href: "/user/family",
    title: "Přidat rodinný účet",
    icon: "child_friendly",
  },
];

export default async function SpeedComponent() {
  const user = await getServerSession(authOptions);

  if (!user || user.user.role === "veřejnost") return null;

  return (
    <SpeedDial
      ariaLabel="IShowSpeed dial"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actionMenu.map((action) => {
        return (
          <SpeedDialAction
            key={action.title}
            slotProps={{
              tooltip: {
                title: action.title,
              },
            }}
            icon={
              <Link
                href={action.href}
                className="flex justify-center items-center w-full h-full"
              >
                <Icon color="action">{action.icon}</Icon>
              </Link>
            }
          />
        );
      })}
    </SpeedDial>
  );
}
