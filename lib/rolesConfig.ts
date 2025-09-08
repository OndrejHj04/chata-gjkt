import { Role } from "@/constants/role";

const sideMenu: {
  name: string;
  icon: string;
  href: string[];
  roles: Role["name"][];
}[] = [
  {
    name: "Přehled",
    icon: "home",
    href: ["/"],
    roles: ["admin", "uživatel", "veřejnost"],
  },
  {
    name: "Uživatelé",
    icon: "person",
    href: ["/user/list"],
    roles: ["admin", "uživatel", "veřejnost"],
  },
  {
    name: "Skupiny",
    icon: "group",
    href: ["/group/list"],
    roles: ["admin", "uživatel", "veřejnost"],
  },
  {
    name: "Rezervace",
    icon: "calendar_month",
    href: ["/reservation/list"],
    roles: ["admin", "uživatel", "veřejnost"],
  },
  {
    name: "Galerie",
    icon: "panorama",
    href: [
      "/photogallery/feed",
      "/photogallery/albums/list",
      "/photogallery/albums/create",
    ],
    roles: ["admin", "uživatel", "veřejnost"],
  },
  {
    name: "Počasí",
    icon: "wb_sunny",
    href: ["/weather"],
    roles: ["admin", "uživatel", "veřejnost"],
  },

];

export { sideMenu };
