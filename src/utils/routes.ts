import { Activity } from "../data/types";

export function makeRouteFromActivity(activity: Activity) {
  return `/info/${activity.type}s/${activity.name.toLowerCase().replace(/ /g, "-").replace(/'/g, "")}`;
}
