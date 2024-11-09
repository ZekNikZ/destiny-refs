import { ArrowClockwise, Calendar, Icon, TreasureChest } from "@phosphor-icons/react";
import TodayPage from "./pages/TodayPage";
import { useGlobalData } from "./data/useGlobalData";
import EncounterBasedActivityPage from "./pages/EncounterBasedActivityPage";
import ActivityListPage from "./pages/ActivityListPage";

export interface RouteData {
  path: string;
  title: string;
  element?: React.ReactNode;
  navbarProperties?: {
    label?: string;
    icon?: Icon;
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
        element: <ActivityListPage activityType="raid" />,
        navbarProperties: {
          icon: TreasureChest,
        },
        children: useGlobalData
          .getState()
          .activities.filter((activity) => activity.type === "raid")
          .map((activity) => ({
            path: "/info/raids/" + activity.name.toLowerCase().replace(/ /g, "-").replace(/'/g, ""),
            title: activity.name,
            element: <EncounterBasedActivityPage activity={activity} />,
          })),
      },
      {
        path: "/info/dungeons",
        title: "Dungeons",
        element: <ActivityListPage activityType="dungeon" />,
        navbarProperties: {
          icon: TreasureChest,
        },
        children: useGlobalData
          .getState()
          .activities.filter((activity) => activity.type === "dungeon")
          .map((activity) => ({
            path:
              "/info/dungeons/" + activity.name.toLowerCase().replace(/ /g, "-").replace(/'/g, ""),
            title: activity.name,
            element: <EncounterBasedActivityPage activity={activity} />,
          })),
      },
    ],
  },
];

export default routes;
