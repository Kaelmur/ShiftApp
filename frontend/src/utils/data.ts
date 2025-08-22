import { LuUsers, LuClipboardCheck, LuLogOut, LuUser } from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Бригады",
    icon: LuUsers,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Смены",
    icon: LuClipboardCheck,
    path: "/admin/shifts",
  },
  {
    id: "04",
    label: "Работники",
    icon: LuUser,
    path: "/admin/users",
  },
  {
    id: "05",
    label: "Выйти",
    icon: LuLogOut,
    path: "/logout",
  },
];

export const SIDE_MENU_SUPER_ADMIN_DATA = [
  {
    id: "01",
    label: "Бригады",
    icon: LuUsers,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Смены",
    icon: LuClipboardCheck,
    path: "/admin/shifts",
  },
  {
    id: "04",
    label: "Работники",
    icon: LuUser,
    path: "/admin/users",
  },
  {
    id: "05",
    label: "Компании",
    icon: LuUser,
    path: "/superadmin/companies",
  },
  {
    id: "06",
    label: "Выйти",
    icon: LuLogOut,
    path: "/logout",
  },
];
