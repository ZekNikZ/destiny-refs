import { ArrowClockwise, Calendar, Icon, TreasureChest } from "@phosphor-icons/react";
import TodayPage from "./pages/TodayPage";
import { useGlobalData } from "./data/useGlobalData";
import EncounterBasedActivityPage from "./pages/EncounterBasedActivityPage";
import ActivityListPage from "./pages/ActivityListPage";
import { makeRouteFromActivity } from "./utils/routes";
import RotationsPage from "./pages/RotationsPage";
import BungiePresentationNodeIcon from "./components/BungiePresentationNodeIcon";

export interface RouteData {
  path: string;
  title: string;
  element?: React.ReactNode;
  navbarProperties?: {
    label?: string;
    icon?: React.ReactNode;
  };
  children?: RouteData[];
}

function makePhosphorIcon(Icon: Icon) {
  return <Icon size={20} />;
}

const routes: RouteData[] = [
  {
    path: "/",
    title: "Today",
    element: <TodayPage />,
    navbarProperties: {
      icon: makePhosphorIcon(Calendar),
    },
  },
  {
    path: "/rotations",
    title: "Rotations",
    element: <RotationsPage />,
    navbarProperties: {
      icon: makePhosphorIcon(ArrowClockwise),
    },
  },
  {
    path: "/info",
    title: "Loot & Details",
    element: <TodayPage />,
    navbarProperties: {
      icon: makePhosphorIcon(TreasureChest),
    },
    children: [
      {
        path: "/info/raids",
        title: "Raids",
        element: <ActivityListPage activityType="raid" />,
        navbarProperties: {
          icon: <BungiePresentationNodeIcon hash={3472409870} />,
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
          icon: <BungiePresentationNodeIcon hash={2196753074} />,
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
        path: "/info/exotic_missions",
        title: "Exotic Missions",
        element: <ActivityListPage activityType="exotic_mission" disableLinks />,
        navbarProperties: {
          icon: <BungiePresentationNodeIcon hash={2916787939} />,
        },
        children: useGlobalData
          .getState()
          .activities.filter((activity) => activity.type === "exotic_mission")
          .map((activity) => ({
            path: makeRouteFromActivity(activity),
            title: activity.name,
            element: <EncounterBasedActivityPage activity={activity} />,
          })),
      },
      {
        path: "/info/nightfalls",
        title: "Nightfalls",
        element: <ActivityListPage activityType="nightfall" disableLinks />,
        navbarProperties: {
          icon: <BungiePresentationNodeIcon hash={1507864044} />,
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
        element: <ActivityListPage activityType="lost_sector" disableLinks />,
        navbarProperties: {
          icon: <BungiePresentationNodeIcon hash={4111930674} />,
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
