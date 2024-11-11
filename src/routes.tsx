import { ArrowClockwise, Calendar, Icon, TreasureChest } from "@phosphor-icons/react";
import TodayPage from "./pages/TodayPage";
import { useGlobalData } from "./data/useGlobalData";
import EncounterBasedActivityPage from "./pages/EncounterBasedActivityPage";
import ActivityListPage from "./pages/ActivityListPage";
import { makeRouteFromActivity } from "./utils/routes";
import RotationsPage from "./pages/RotationsPage";

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
    element: <RotationsPage />,
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
            path: makeRouteFromActivity(activity),
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
            path: makeRouteFromActivity(activity),
            title: activity.name,
            element: <EncounterBasedActivityPage activity={activity} />,
          })),
      },
      {
        path: "/info/nightfalls",
        title: "Nightfalls",
        element: <ActivityListPage activityType="nightfall" />,
        navbarProperties: {
          icon: TreasureChest,
        },
        children: useGlobalData
          .getState()
          .activities.filter((activity) => activity.type === "nightfall")
          .map((activity) => ({
            path: makeRouteFromActivity(activity),
            title: activity.name,
            element: <EncounterBasedActivityPage activity={activity} />,
          })),
      },
      {
        path: "/info/lost_sectors",
        title: "Lost Sectors",
        element: <ActivityListPage activityType="lost_sector" />,
        navbarProperties: {
          icon: TreasureChest,
        },
        children: useGlobalData
          .getState()
          .activities.filter((activity) => activity.type === "lost_sector")
          .map((activity) => ({
            path: makeRouteFromActivity(activity),
            title: activity.name,
            element: <EncounterBasedActivityPage activity={activity} />,
          })),
      },
    ],
  },
];

export default routes;
