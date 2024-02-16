import { AppShell, Burger, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome2 } from "@tabler/icons-react";
import { createRootRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { useSidebarStore } from "../data/useSidebarStore";
import routes, { buildTree } from "../utils/routes";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const [opened, { toggle }] = useDisclosure();
  const routerState = useRouterState();
  const navigate = useNavigate();
  const { openTab, setOpenTab } = useSidebarStore();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          breakpoint: "sm",
          collapsed: { mobile: !opened },
          width: 300,
        }}
        padding="md"
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div>Logo</div>
        </AppShell.Header>

        <AppShell.Navbar p="sm">
          {buildTree(routes, ({ label, href, test }, childLinks) => {
            const isSelected =
              typeof test === "string"
                ? routerState.resolvedLocation.pathname === test
                : test.test(routerState.resolvedLocation.pathname);
            return (
              <NavLink
                key={`${href}-${isSelected}`}
                label={label}
                color="blue"
                variant={isSelected ? "light" : "subtle"}
                leftSection={<IconHome2 size="1rem" stroke={1.5} />}
                active={routerState.resolvedLocation.pathname === (typeof test === "string" ? test : "zzz")}
                onClick={() => {
                  navigate({ to: href });
                  setOpenTab(href);
                }}
                childrenOffset="sm"
                opened={openTab.startsWith(typeof test === "string" ? test : "zzz")}
              >
                {childLinks}
              </NavLink>
            );
          })}
        </AppShell.Navbar>

        <AppShell.Main>
          <div className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>{" "}
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
          </div>
          <hr />
          <Outlet />
        </AppShell.Main>
      </AppShell>

      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  );
}
