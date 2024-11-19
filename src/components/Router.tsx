import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from "react-router-dom";
import routes, { RouteData } from "../routes";
import Layout from "./Layout";

function routeDataToRoute(routeData: RouteData): RouteObject {
  const { path, element, children, title } = routeData;
  return {
    path,
    element,
    children: children?.map(routeDataToRoute),
    handle: title,
  };
}

function flattenRoutes(route: RouteObject): RouteObject[] {
  if (route.element && route.children) {
    return [{ ...route, children: [] }, ...route.children.flatMap(flattenRoutes)];
  } else {
    return [route];
  }
}

export const flattenedRoutes = routes.map(routeDataToRoute).flatMap(flattenRoutes);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Navigate replace to="/" />,
    children: flattenedRoutes,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
