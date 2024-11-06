import { ArrowClockwise, Calendar, Icon, TreasureChest } from "@phosphor-icons/react";
import TodayPage from "./pages/TodayPage";

export interface RouteData {
  path: string;
  title: string;
  element?: React.ReactNode;
  navbarProperties?: {
    label?: string;
    icon: Icon;
  };
  children?: RouteData[];
}

const routes: RouteData[] = [
  {
    path: "/",
    title: "Today",
    element: <TodayPage />,
    navbarProperties: {
      icon: Calendar,
    },
  },
  {
    path: "/rotations",
    title: "Rotations",
    element: <TodayPage />,
    navbarProperties: {
      icon: ArrowClockwise,
    },
  },
  {
    path: "/info",
    title: "Loot & Details",
    element: <TodayPage />,
    navbarProperties: {
      icon: TreasureChest,
    },
    children: [
      {
        path: "/info/raids",
        title: "Raids",
        element: <TodayPage />,
        navbarProperties: {
          icon: TreasureChest,
        },
        children: [
          {
            path: "/info/raids/vault-of-glass",
            title: "Vault of Glass",
            element: <TodayPage />,
            navbarProperties: {
              icon: TreasureChest,
            },
          },
        ],
      },
    ],
  },
];

export default routes;
