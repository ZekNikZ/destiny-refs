import { Badge, Card, Group, Stack, Title, useMantineTheme, Text, List } from "@mantine/core";
import { ActivityAvailability, LootPool } from "../../data/types";
import React from "react";
import LootListing from "./LootListing";
import { numberToCardinal } from "../../utils/number-to-words";

interface Props {
  lootPools: LootPool[];
  availability?: ActivityAvailability;
}

export default function LootTable(props: Props) {
  const theme = useMantineTheme();

  return (
    <Group gap="xs">
      {props.lootPools.map((pool, index) => {
        if (pool.type === "mode_specific") {
          return (
            <Stack gap="xs" key={index} style={{ flexGrow: 1 }}>
              {pool.modes.map((mode) => (
                <React.Fragment key={mode.mode}>
                  <Group gap="sm">
                    <Title size="h3">{mode.mode.toUpperCase()} MODE</Title>
                    {!props.availability?.masterAvailable && mode.mode === "master" && (
                      <Badge color="red" radius="sm">
                        Not available this week
                      </Badge>
                    )}
                  </Group>
                  <LootTable lootPools={mode.children} availability={props.availability} />
                </React.Fragment>
              ))}
            </Stack>
          );
        } else {
          return (
            <Card
              padding="xs"
              withBorder
              bg={theme.colors.dark[7]}
              key={index}
              style={{ flexGrow: 1 }}
            >
              <Stack gap="sm">
                {/* Header */}
                <Group gap="sm">
                  <Text size="md" fw="bold" fs="italic">
                    {pool.quantity === "chance"
                      ? "CHANCE FOR"
                      : pool.quantity === "all"
                        ? "GUARANTEED"
                        : `${numberToCardinal(pool.quantity)} OF`}
                    {pool.knockout && " (KNOCKOUT)"}
                  </Text>
                  {props.availability?.doubleLootActive &&
                    pool.doubleLootWhen === "double_loot_is_active" && (
                      <Badge color="blue" radius="sm">
                        Double Loot Active
                      </Badge>
                    )}
                  {((props.availability?.featured &&
                    pool.availableWhen === "activity_not_featured") ||
                    (!props.availability?.featured &&
                      pool.availableWhen === "activity_is_featured") ||
                    (!props.availability?.challengeActive &&
                      pool.availableWhen === "challenge_completion")) && (
                    <Badge color="red" radius="sm">
                      Not available this week
                    </Badge>
                  )}
                  {props.availability?.challengeActive &&
                    pool.availableWhen === "challenge_completion" && (
                      <Badge color="green" radius="sm">
                        Challenge Reward
                      </Badge>
                    )}
                </Group>

                {/* Loot */}
                <Group gap="xs">
                  {pool.loot.map((loot) => (
                    <LootListing
                      key={loot.type === "item" ? loot.itemHash : loot.name}
                      loot={loot}
                    />
                  ))}
                </Group>

                {/* Notes */}
                <List>
                  {/* Limit */}
                  {pool.weeklyLimit === "once_per_character" && (
                    <List.Item>Available once per character each week.</List.Item>
                  )}
                  {pool.weeklyLimit === "once_per_account" && (
                    <List.Item>Available once per account each week.</List.Item>
                  )}
                  {pool.weeklyLimit === "infinite_after_first_clear" && (
                    <List.Item>
                      <Text>
                        Only available{" "}
                        <Text fw="bold" span>
                          after
                        </Text>{" "}
                        first clear of the week (per character).
                      </Text>
                    </List.Item>
                  )}
                  {pool.weeklyLimit === "infinite_when_featured" &&
                    props.availability?.featured && (
                      <>
                        <List.Item td="line-through">
                          Available once per character each week.
                        </List.Item>
                        <List.Item>
                          Activity is featured: will drop every completion this week (
                          <Text c="blue" span fw="bold">
                            farmable
                          </Text>
                          ).
                        </List.Item>
                      </>
                    )}

                  {/* Knockout */}
                  {pool.knockout && (
                    <List.Item>
                      This loot pool is on a{" "}
                      <Text fw="bold" span>
                        knockout system
                      </Text>
                      . You will recieve a new item from this pool each time until you have
                      collected all of them.
                    </List.Item>
                  )}

                  {/* Pinnacle */}
                  {(pool.pinnacleWhen === "always" ||
                    (pool.pinnacleWhen === "activity_is_featured" &&
                      props.availability?.featured)) && (
                    <List.Item>
                      Activity is featured: first drop this week (per character) will be{" "}
                      <Text c="pink" fw="bold" span>
                        pinnacle
                      </Text>
                      .
                    </List.Item>
                  )}

                  {/* Double Loot */}
                  {pool.doubleLootWhen === "double_loot_is_active" && (
                    <List.Item>
                      <Text c="blue" span fw="bold">
                        Double loot
                      </Text>{" "}
                      is active this week: drops doubled.
                    </List.Item>
                  )}
                  {pool.doubleLootWhen === "challenge_completion" &&
                    props.availability?.challengeActive && (
                      <List.Item>
                        <Text c="green" span fw="bold">
                          Challenge is active
                        </Text>
                        : successful challenge completion will reward{" "}
                        <Text c="blue" span fw="bold">
                          double loot
                        </Text>
                        .
                      </List.Item>
                    )}

                  {/* Availability */}
                  {pool.availableWhen === "activity_is_featured" &&
                    !props.availability?.featured && (
                      <List.Item>
                        Activity is not featured:{" "}
                        <Text fw="bold" c="red" span>
                          will not drop
                        </Text>{" "}
                        this week.
                      </List.Item>
                    )}
                  {pool.availableWhen === "activity_not_featured" &&
                    props.availability?.featured && (
                      <List.Item>
                        Activity is featured:{" "}
                        <Text fw="bold" c="red" span>
                          will not drop
                        </Text>{" "}
                        this week.
                      </List.Item>
                    )}
                  {pool.availableWhen === "challenge_completion" &&
                    props.availability?.challengeActive && (
                      <List.Item>
                        Only available upon{" "}
                        <Text fw="bold" c="green" span>
                          successful challenge completion
                        </Text>
                        .
                      </List.Item>
                    )}
                  {pool.availableWhen === "challenge_completion" &&
                    !props.availability?.challengeActive && (
                      <List.Item>
                        Only available upon{" "}
                        <Text fw="bold" c="green" span>
                          successful challenge completion
                        </Text>{" "}
                        (
                        <Text fw="bold" c="red" span>
                          not available this week
                        </Text>
                        ).
                      </List.Item>
                    )}
                </List>
              </Stack>
            </Card>
          );
        }
      })}
    </Group>
  );
}
