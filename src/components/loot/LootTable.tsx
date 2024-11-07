import { Badge, Card, Group, Stack, Title, useMantineTheme, Text, List } from "@mantine/core";
import { LootPool } from "../../data/types";
import React from "react";
import LootListing from "./LootListing";
import { numberToCardinal } from "../../utils/number-to-words";

interface Props {
  lootPools: LootPool[];
}

export default function LootTable(props: Props) {
  const theme = useMantineTheme();

  return (
    <Stack gap="xs">
      {props.lootPools.map((pool, index) => {
        if (pool.type === "mode_specific") {
          return (
            <Stack gap="xs" key={index}>
              {pool.modes.map((mode) => (
                <React.Fragment key={mode.mode}>
                  <Title size="h3">{mode.mode.toUpperCase()} MODE</Title>
                  <LootTable lootPools={mode.children} />
                </React.Fragment>
              ))}
            </Stack>
          );
        } else {
          return (
            <Card padding="xs" withBorder bg={theme.colors.dark[7]} key={index}>
              <Stack gap="sm">
                <Group gap="sm">
                  <Text size="md" fw="bold" fs="italic">
                    {pool.quantity === "chance"
                      ? "CHANCE FOR"
                      : pool.quantity === "all"
                        ? "GUARANTEED"
                        : `${numberToCardinal(pool.quantity)} OF`}
                  </Text>
                  {/* TODO: tags */}
                  <Badge color="blue" radius="sm">
                    Double Loot Active
                  </Badge>
                  <Badge color="red" radius="sm">
                    Not available this week
                  </Badge>
                </Group>
                <Group gap="xs">
                  {pool.loot.map((loot) => (
                    <LootListing
                      key={loot.type === "item" ? loot.itemHash : loot.name}
                      loot={loot}
                    />
                  ))}
                </Group>
                {/* TODO: notes */}
                <List>
                  <List.Item>
                    Activity is featured: first drop this week (per character) will be{" "}
                    <Text c="pink" fw="bold" span>
                      pinnacle
                    </Text>
                    .
                  </List.Item>
                  <List.Item>
                    <Text td="line-through">Available once per character each week.</Text>
                  </List.Item>
                  <List.Item>
                    Activity is featured: will drop every completion this week (
                    <Text c="blue" span fw="bold">
                      farmable
                    </Text>
                    ).
                  </List.Item>
                  <List.Item>
                    <Text>
                      Only available{" "}
                      <Text fw="bold" span>
                        after
                      </Text>{" "}
                      first clear of the week (per character).
                    </Text>
                  </List.Item>
                  <List.Item>Available once per account each week.</List.Item>
                  <List.Item>
                    <Text c="blue" span fw="bold">
                      Double loot
                    </Text>{" "}
                    is active this week: drops doubled.
                  </List.Item>
                  <List.Item>
                    Activity is featured:{" "}
                    <Text fw="bold" c="red" span>
                      will not drop
                    </Text>{" "}
                    this week.
                  </List.Item>
                </List>
              </Stack>
            </Card>
          );
        }
      })}
    </Stack>
  );
}
