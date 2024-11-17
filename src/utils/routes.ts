import { Activity } from "../data/types";
import { activityTypes } from "../routes";

export function makeRouteFromActivity(activity: Activity) {
  const activityType = activityTypes.find((activityType) => activityType.type === activity.type);
  const dashboardPage = activityType?.disableLinks;

  if (dashboardPage) {
    return `/info/${activity.type}s`;
  } else {
    return `/info/${activity.type}s/${activity.name.toLowerCase().replace(/ /g, "-").replace(/'/g, "")}`;
  }
}
