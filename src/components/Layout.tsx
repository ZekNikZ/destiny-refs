import { ActionIcon, AppShell, Box, Burger, Group, ScrollArea, Text } from "@mantine/core";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GithubLogo } from "@phosphor-icons/react";
import NavLinkWithChildren from "./NavLinkWithChildren";
import { flattenedRoutes } from "./Router";
import routes from "../routes";
import { useMemo } from "react";

export default function Layout() {
  const [opened, { toggle, close }] = useDisclosure();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const title = useMemo(
    () =>
      flattenedRoutes
        .filter((route) => route.path && route.path !== "/" && pathname.startsWith(route.path))
        .sort((a, b) => b.path!.length - a.path!.length)[0]?.handle,
    [pathname]
  );

  useDocumentTitle(title ? `${title} | Destiny Refs` : "Destiny Refs");

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="sm">
        <Group align="center" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Box onClick={() => navigate("/")}>
              <Group gap="xs" style={{ cursor: "pointer" }} align="end">
                <Text size="2.2rem" ff="Bebas Neue">
                  Destiny Refs
                </Text>
                <Text size="1.4rem" ff="Bebas Neue" c="blue" mb={2}>
                  by ZekNikZ
                </Text>
              </Group>
            </Box>
          </Group>
          <Group gap="xs">
            <ActionIcon
              variant="default"
              aria-label="Refresh data"
              size="lg"
              style={{ justifySelf: "end" }}
              component="a"
              href="https://github.com/ZekNikZ/destiny-refs"
              target="_blank"
            >
              <GithubLogo size="65%" />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <ScrollArea type="never">
          {routes
            .filter((route) => !route.navbarProperties?.hidden)
            .map((route) => (
              <NavLinkWithChildren
                route={route}
                key={route.path}
                onClick={(route) => {
                  if (!route.children) close();
                }}
              />
            ))}
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main pos="relative">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
