import { Role } from "@/constants/role";

const sideMenu: {name:string, icon:string, href: string[], roles: Role['name'][]}[] = [
  { name: "Přehled", icon: "home", href: ["/"], roles: ['admin', 'uživatel', 'veřejnost'] },
  { name: "Uživatelé", icon: "person", href: ["/user/list"], roles: ['admin', 'uživatel', 'veřejnost'] },
  { name: "Skupiny", icon: "group", href: ["/group/list"], roles: ['admin', 'uživatel', 'veřejnost'] },
  {
    name: "Rezervace",
    icon: "calendar_month",
    href: ["/reservation/list"],
    roles: ['admin', 'uživatel', 'veřejnost'],
  },
  {
    name: "Aktivní registrace",
    icon: "assignment",
    href: ["/registration/list"],
    roles: ['admin', 'uživatel'],
  },
  { name: "Archiv", icon: "bookmark", href: ["/archive/list"], roles: ['admin', 'uživatel'] },
  {
    name: "Mailing",
    icon: "alternate_email",
    href: ["/mailing/send", "/mailing/templates", "/mailing/events"],
    roles: ['admin', 'uživatel'],
  },
  {
    name: "Galerie",
    icon: "panorama",
    href: [
      "/photogallery/feed",
      "/photogallery/albums/list",
      "/photogallery/albums/create",
    ],
    roles: ['admin', 'uživatel', 'veřejnost'],
  },
  { name: "Počasí", icon: "wb_sunny", href: ["/weather"], roles: ['admin', 'uživatel', 'veřejnost'] },
  {
    name: "Přehledné zobrazení",
    icon: "view_timeline",
    href: ["/data_overview"],
    roles: ['admin', 'uživatel'],
  },
  { name: "Nastavení", icon: "settings", href: ["/settings"], roles: ["admin"] },
];

const actionMenu = [
  {
    href: "/reservation/create",
    name: "Vytvořit rezervaci",
    icon: "edit_calendar",
    roles: ['admin', 'uživatel', 'veřejnost'],
  },
  {
    href: "/group/create",
    name: "Vytvořit skupinu",
    icon: "group_add",
    roles: ['admin', 'uživatel', 'veřejnost'],
  },
  {
    href: "/user/import",
    name: "Importovat uživatele",
    icon: "import_export",
    roles: ['admin', 'uživatel'],
  },
  {
    href: "/user/create",
    name: "Vytvořit uživatele",
    icon: "person_add",
    roles: ['admin', 'uživatel', 'veřejnost'],
  },
  {
    href: "/user/family",
    name: "Přidat rodinný účet",
    icon: "child_friendly",
    roles: ['admin', 'uživatel', 'veřejnost'],
  },
];

const otherRoutes = ["/password-reset", "/vzorovy_soubor.csv", "/podminky.pdf"];

export { sideMenu, actionMenu, otherRoutes };
