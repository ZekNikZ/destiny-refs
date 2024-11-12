import { ArrowClockwise, Calendar, Icon, TreasureChest } from "@phosphor-icons/react";
import TodayPage from "./pages/TodayPage";
import { useGlobalData } from "./data/useGlobalData";
import EncounterBasedActivityPage from "./pages/EncounterBasedActivityPage";
import ActivityListPage from "./pages/ActivityListPage";
import { makeRouteFromActivity } from "./utils/routes";
import RotationsPage from "./pages/RotationsPage";
import BungiePresentationNodeIcon from "./components/BungiePresentationNodeIcon";
import LootAndDetailsPage from "./pages/LootAndDetailsPage";
import { ActivityType } from "./data/types";

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

export const activityTypes: {
  type: ActivityType;
  title: string;
  presentationNodeHash: number;
  backgroundImage: string;
  disableLinks?: boolean;
}[] = [
  {
    type: "raid",
    title: "Raids",
    presentationNodeHash: 3472409870,
    backgroundImage: "/images/raids/salvations-edge/banner.avif",
  },
  {
    type: "dungeon",
    title: "Dungeons",
    presentationNodeHash: 2196753074,
    backgroundImage: "/images/dungeons/vespers-host/banner.avif",
  },
  {
    type: "exotic_mission",
    title: "Exotic Missions",
    presentationNodeHash: 2916787939,
    backgroundImage: "/images/exotic_missions/zero-hour.avif",
    disableLinks: true,
  },
  {
    type: "nightfall",
    title: "Nightfalls",
    presentationNodeHash: 1507864044,
    backgroundImage: "/images/nightfalls/liminality.avif",
    disableLinks: true,
  },
  {
    type: "lost_sector",
    title: "Lost Sectors",
    presentationNodeHash: 4111930674,
    backgroundImage: "/images/lost_sectors/sepulcher.avif",
    disableLinks: true,
  },
];

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
    element: <LootAndDetailsPage />,
    navbarProperties: {
      icon: makePhosphorIcon(TreasureChest),
    },
    children: activityTypes.map((activityType) => ({
      path: `/info/${activityType.type}s`,
      title: activityType.title,
      element: <ActivityListPage activityType={activityType.type} />,
      navbarProperties: {
        icon: <BungiePresentationNodeIcon hash={activityType.presentationNodeHash} />,
      },
      children: useGlobalData
        .getState()
        .activities.filter((activity) => activity.type === activityType.type)
        .map((activity) => ({
          path: makeRouteFromActivity(activity),
          title: activity.name,
          element: <EncounterBasedActivityPage activity={activity} />,
        })),
    })),
  },
];

export default routes;
