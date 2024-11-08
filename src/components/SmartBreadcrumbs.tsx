import { Breadcrumbs, Text } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { flattenedRoutes } from "./Router";

import classes from "./SmartBreadcrumbs.module.scss";

export default function SmartBreadcrumbs() {
  const { pathname } = useLocation();

  const routes = flattenedRoutes
    .filter((route) => route.path && route.path !== "/" && pathname.startsWith(route.path))
    .sort((a, b) => a.path!.length - b.path!.length);

  return (
    <Breadcrumbs>
      {routes.map((route, index) =>
        index < routes.length - 1 ? (
          <Link key={route.path} to={route.path!} color="blue" className={classes.link}>
            {route.handle}
          </Link>
        ) : (
          <Text key={route.path}>{route.handle}</Text>
        )
      )}
    </Breadcrumbs>
  );
}
