import {
  ArrowClockwise,
  Bookmarks,
  Calendar,
  Gear,
  HandHeart,
  Icon,
  Info,
  Toolbox,
  TreasureChest,
} from "@phosphor-icons/react";
import TodayPage from "./pages/TodayPage";
import { useGlobalData } from "./data/useGlobalData";
import EncounterBasedActivityPage from "./pages/EncounterBasedActivityPage";
import ActivityListPage from "./pages/ActivityListPage";
import { makeRouteFromActivity } from "./utils/routes";
import RotationsPage from "./pages/RotationsPage";
import BungiePresentationNodeIcon from "./components/BungiePresentationNodeIcon";
import LootAndDetailsPage from "./pages/LootAndDetailsPage";
import { ActivityType } from "./data/types";
import ContactPage from "./pages/ContactPage";
import FireteamRaidReport from "./pages/tools/FireteamRaidReport";
import SettingsPage from "./pages/SettingsPage";
import VerityHelperPage from "./pages/tools/VerityHelperPage";
import WheelOfMisfortune from "./pages/tools/WheelOfMisfortune";
import ToolsPage from "./pages/ToolsPage";
import HelpfulLinksPage from "./pages/HelpfulLinksPage";

export interface RouteData {
  path: string;
  title: string;
  link?: string;
  element?: React.ReactNode;
  navbarProperties?: {
    label?: string;
    icon?: React.ReactNode;
    hidden?: boolean;
    beta?: boolean;
  };
  displayProperties?: {
    backgroundImage?: string;
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
  dashboard?: boolean;
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
    backgroundImage: "/images/dungeons/sundered-doctrine/banner.avif",
  },
  {
    type: "exotic_mission",
    title: "Exotic Missions",
    presentationNodeHash: 2916787939,
    backgroundImage: "/images/exotic_missions/zero-hour.avif",
    disableLinks: true,
    dashboard: true,
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
      element: (
        <ActivityListPage
          activityType={activityType.type}
          disableLinks={activityType.disableLinks}
          dashboard={activityType.dashboard}
        />
      ),
      navbarProperties: {
        icon: <BungiePresentationNodeIcon hash={activityType.presentationNodeHash} />,
      },
      children: !activityType.disableLinks
        ? useGlobalData
            .getState()
            .activities.filter((activity) => activity.type === activityType.type)
            .map((activity) => ({
              path: makeRouteFromActivity(activity),
              title: activity.name,
              element: <EncounterBasedActivityPage activity={activity} />,
            }))
        : undefined,
    })),
  },
  {
    path: "/tools",
    title: "Tools & Toys",
    element: <ToolsPage />,
    navbarProperties: {
      icon: makePhosphorIcon(Toolbox),
    },
    children: [
      {
        path: "/tools/vow-chest",
        title: "VOTD Deepsight Puzzle",
        element: <TodayPage />,
        navbarProperties: {
          hidden: true,
        },
      },
      {
        path: "/tools/kf-chest",
        title: "KF Deepsight Puzzle",
        element: <TodayPage />,
        navbarProperties: {
          hidden: true,
        },
      },
      {
        path: "/tools/se-verity",
        title: "SE Verity Helper",
        element: <VerityHelperPage />,
        navbarProperties: {
          hidden: true,
        },
      },
      {
        path: "/tools/raid-summary",
        title: "Fireteam Raid Summary",
        element: <FireteamRaidReport />,
        navbarProperties: {
          beta: true,
        },
        displayProperties: {
          backgroundImage: "/images/misc/fireteam.avif",
        },
      },
      {
        path: "/tools/wheel-of-misfortune",
        title: "Wheel of Misfortune",
        element: <WheelOfMisfortune />,
        navbarProperties: {
          beta: true,
        },
        displayProperties: {
          backgroundImage: "/images/misc/wheel.avif",
        },
      },
    ],
  },
  {
    path: "/links",
    title: "Links & Resources",
    element: <HelpfulLinksPage />,
    navbarProperties: {
      icon: makePhosphorIcon(Bookmarks),
    },
  },
  {
    path: "/contact",
    title: "Contact",
    element: <ContactPage />,
    navbarProperties: {
      icon: makePhosphorIcon(Info),
    },
  },
  {
    path: "/donate",
    title: "Donate",
    link: "https://ko-fi.com/zeknikz",
    navbarProperties: {
      icon: makePhosphorIcon(HandHeart),
    },
  },
  {
    path: "/settings",
    title: "Settings",
    element: <SettingsPage />,
    navbarProperties: {
      icon: makePhosphorIcon(Gear),
    },
  },
];

export default routes;
