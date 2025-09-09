"use client";
import Drawer from "@mui/material/Drawer";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Icon, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { PanelContext } from "@/app/clientProvider";
import { useContext } from "react";
import { Role } from "@/constants/role";

const publicMenuConfig = [
  {
    name: "Přehled",
    icon: "home",
    href: "/",
  },
  {
    name: "Uživatelé",
    icon: "person",
    href: "/user/list",
  },
  {
    name: "Skupiny",
    icon: "group",
    href: "/group/list",
  },
  {
    name: "Rezervace",
    icon: "calendar_month",
    href: "/reservation/list",
  },
  {
    name: "Galerie",
    icon: "panorama",
    href: "/photogallery/feed",
  },
  {
    name: "Počasí",
    icon: "wb_sunny",
    href: "/weather",
  },
];

const protectedMenuConfig = [
  {
    name: "Aktivní registrace",
    icon: "assignment",
    href: "/registration/list",
    roles: ["admin"],
  },
  {
    name: "Archiv",
    icon: "bookmark",
    href: "/archive/list",
    roles: ["admin"],
  },
  {
    name: "Mailing",
    icon: "alternate_email",
    href: "/mailing/send",
    roles: ["admin"],
  },
  {
    name: "Přehledné zobrazení",
    icon: "view_timeline",
    href: "/data_overview",
    roles: ["admin"],
  },
  {
    name: "Nastavení",
    icon: "settings",
    href: "/settings",
    roles: ["admin"],
  },
];
export default function SlidingMenu({
  userRole,
}: {
  userRole: Role["name"] | undefined;
}) {
  const { panel, setPanel } = useContext(PanelContext);

  const menuConfig = [
    ...publicMenuConfig,
    ...(userRole
      ? protectedMenuConfig.filter(({ roles }) => roles.includes(userRole))
      : []),
  ];
  return (
    <Drawer anchor="left" open={panel} onClose={() => setPanel(false)}>
      <div className="h-full flex flex-col justify-between">
        <MenuList>
          {menuConfig.map((item) => (
            <MenuItem
              key={item.name}
              component={Link}
              href={item.href}
              onClick={() => setPanel(false)}
            >
              <Icon fontSize="large" color="primary">
                {item.icon}
              </Icon>
              <Typography variant="h6" style={{ margin: "0 0 0 10px" }}>
                {item.name}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>

        <MenuItem
          disabled={!userRole}
          onClick={() => signOut({ callbackUrl: "/", redirect: true })}
        >
          <LogoutIcon fontSize="large" color="error" />
          <Typography variant="h6" style={{ margin: "0 0 0 10px" }}>
            Odhlásit se
          </Typography>
        </MenuItem>
      </div>
    </Drawer>
  );
}
