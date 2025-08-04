import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuLogOut,
  LuUser,
} from "react-icons/lu";

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

export const SIDE_MENU_SUPERADMIN_DATA = [
  {
    id: "01",
    label: "Главная",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "Мои Задачи",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "05",
    label: "Выйти",
    icon: LuLogOut,
    path: "/logout",
  },
];
