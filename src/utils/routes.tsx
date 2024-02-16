import { ReactNode } from "react";

interface RouteInfo {
  label: string;
  test: RegExp | string;
  href: string;
  children?: RouteInfo[];
}

const routes: RouteInfo[] = [
  { href: "/", label: "Home", test: /^\/$/ },
  {
    children: [
      { href: "/raids/root-of-nightmares", label: "Root of Nightmares", test: "/raids/root-of-nightmares" },
      { href: "/raids/vow-of-the-disciple", label: "Vow of the Disciple", test: "/raids/vow-of-the-disciple" },
    ],
    href: "/raids",
    label: "Raids",
    test: "/raids",
  },
  {
    children: [
      { href: "/dungeons/ghosts-of-the-deep", label: "Ghosts of the Deep", test: "/dungeons/ghosts-of-the-deep" },
      { href: "/dungeons/spire-of-the-watcher", label: "Spire of the Watcher", test: "/dungeons/spire-of-the-watcher" },
    ],
    href: "/dungeons",
    label: "Dungeons",
    test: "/dungeons",
  },
];

export function buildTree(
  routes: RouteInfo[],
  builder: (info: RouteInfo, children?: ReactNode[]) => ReactNode
): ReactNode[] | undefined {
  if (routes.length === 0) {
    return undefined;
  }

  return routes.map((info) => builder(info, buildTree(info.children ?? [], builder)));
}

export default routes;
