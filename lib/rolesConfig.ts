const sideMenu = [
  { name: "Přehled", icon: "home", href: ["/"], roles: [1, 2, 3] },
  { name: "Uživatelé", icon: "person", href: ["/user/list"], roles: [1, 2, 3] },
  { name: "Skupiny", icon: "group", href: ["/group/list"], roles: [1, 2, 3] },
  { name: "Rezervace", icon: "calendar_month", href: ["/reservation/list"], roles: [1, 2, 3] },
  { name: "Aktivní registrace", icon: "assignment", href: ["/registration/list"], roles: [1, 2] },
  { name: "Archiv", icon: "bookmark", href: ["/archive/list"], roles: [1, 2] },
  { name: "Mailing", icon: "alternate_email", href: ["/mailing/send", "/mailing/templates", "/mailing/events"], roles: [1, 2] },
  { name: "Galerie", icon: "panorama", href: ["/photogallery/my-photos", "/photogallery/albums", "/photogallery/photo-feed"], roles: [1, 2, 3] },
  { name: "Počasí", icon: "wb_sunny", href: ["/weather"], roles: [1, 2, 3] },
  { name: "Přehledné zobrazení", icon: "view_timeline", href: ["/data_overview"], roles: [1, 2] },
  { name: "Nastavení", icon: "settings", href: ["/settings"], roles: [1] },
];

const actionMenu = [
  { href: "/reservation/create", name: "Vytvořit rezervaci", icon: "edit_calendar", roles: [1, 2, 3] },
  { href: "/group/create", name: "Vytvořit skupinu", icon: "group_add", roles: [1, 2, 3] },
  { href: "/user/import", name: "Importovat uživatele", icon: "import_export", roles: [1, 2] },
  { href: "/user/create", name: "Vytvořit uživatele", icon: "person_add", roles: [1, 2, 3] },
  { href: "/user/family", name: "Přidat rodinný účet", icon: "child_friendly", roles: [1, 2, 3] },
]

const otherRoutes = ['/password-reset', '/vzorovy_soubor.csv', '/podminky.pdf']

export { sideMenu, actionMenu, otherRoutes }
