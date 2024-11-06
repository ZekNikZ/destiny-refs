import { ActionIcon, AppShell, Box, Burger, Group, ScrollArea, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, useNavigate } from "react-router-dom";
import routes from "../routes";
import { GithubLogo } from "@phosphor-icons/react";
import NavLinkWithChildren from "./NavLinkWithChildren";

export default function Layout() {
  const [opened, { toggle, close }] = useDisclosure();
  const navigate = useNavigate();

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
              <Group gap={0} style={{ cursor: "pointer" }}>
                <Text size="2.2rem" ff="Bebas Neue">
                  Destiny Refs
                </Text>
                <Text size="2.2rem" ff="Bebas Neue" c="blue" ml="xs">
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
              visibleFrom="sm"
              component="a"
              href="https://github.com/ZekNikZ/destiny-refs"
              target="_blank"
            >
              <GithubLogo style={{ width: "70%", height: "70%" }} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <ScrollArea type="never">
          {routes.map((route) => (
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
