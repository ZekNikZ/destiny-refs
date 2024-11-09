import { Badge, Card, Group, Stack, Title, useMantineTheme, Text, List, Box } from "@mantine/core";
import { Activity, ActivityAvailability, LootPool } from "../../data/types";
import React from "react";
import LootListing from "./LootListing";
import { numberToCardinal } from "../../utils/number-to-words";
import classes from "./LootTable.module.scss";
import { getLootKey } from "../../utils/loot";

interface Props {
  lootPools: LootPool[];
  availability?: ActivityAvailability;
  activity: Activity;
}

export default function LootTable(props: Props) {
  const theme = useMantineTheme();

  const challengeActive =
    props.availability?.allChallengesActive ||
    props.availability?.activeChallenges?.includes(props.activity.id);

  return (
    <Group gap="xs" align="stretch">
      {props.lootPools.map((pool, index) => {
        if (pool.type === "ref-loot-pool") {
          throw new Error("Ref loot pools are not supported in LootTable");
        } else if (pool.type === "mode_specific") {
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
                  <LootTable
                    lootPools={mode.children}
                    availability={props.availability}
                    activity={props.activity}
                  />
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
              style={{
                flexGrow: 1,
                flexBasis: pool.loot.length === 1 ? "320px" : undefined,
              }}
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
                    (!challengeActive && pool.availableWhen === "challenge_completion")) && (
                    <Badge color="red" radius="sm">
                      Not available this week
                    </Badge>
                  )}
                  {challengeActive && pool.availableWhen === "challenge_completion" && (
                    <Badge color="green" radius="sm">
                      Challenge Reward
                    </Badge>
                  )}
                </Group>

                {/* Loot */}
                <Box
                  display="grid"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "var(--mantine-spacing-xs)",
                  }}
                >
                  {pool.loot.map((loot) => (
                    <LootListing key={getLootKey(loot)} loot={loot} />
                  ))}
                </Box>

                {/* Notes */}
                <List classNames={{ item: classes.listItem }}>
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
                        <List.Item>
                          <Text td="line-through" span>
                            Available once per character each week.
                          </Text>{" "}
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
                  {pool.doubleLootWhen === "challenge_completion" && challengeActive && (
                    <List.Item>
                      <Text c="green" span fw="bold">
                        Challenge is active
                      </Text>
                      : successful challenge completion (once per character) will reward an{" "}
                      <Text c="blue" span fw="bold">
                        extra drop
                      </Text>
                      .
                    </List.Item>
                  )}
                  {pool.doubleLootWhen === "challenge_completion_repeatable" && challengeActive && (
                    <List.Item>
                      <Text c="green" span fw="bold">
                        Challenge is active
                      </Text>
                      : successful challenge completion (repeatable) will reward an{" "}
                      <Text c="blue" span fw="bold">
                        extra drop
                      </Text>
                      .
                    </List.Item>
                  )}
                  {pool.doubleLootWhen === "challenge_completion" && !challengeActive && (
                    <List.Item>
                      <Text fw="bold" c="blue" span>
                        Extra drop
                      </Text>{" "}
                      upon{" "}
                      <Text fw="bold" c="green" span>
                        successful challenge completion
                      </Text>{" "}
                      (once per character) (
                      <Text fw="bold" c="red" span>
                        not available this week
                      </Text>
                      ).
                    </List.Item>
                  )}
                  {pool.doubleLootWhen === "challenge_completion_repeatable" &&
                    !challengeActive && (
                      <List.Item>
                        <Text fw="bold" c="blue" span>
                          Extra drop
                        </Text>{" "}
                        upon{" "}
                        <Text fw="bold" c="green" span>
                          successful challenge completion
                        </Text>{" "}
                        (repeatable) (
                        <Text fw="bold" c="red" span>
                          not available this week
                        </Text>
                        ).
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
                  {pool.availableWhen === "challenge_completion" && challengeActive && (
                    <List.Item>
                      Only available upon{" "}
                      <Text fw="bold" c="green" span>
                        successful challenge completion
                      </Text>
                      .
                    </List.Item>
                  )}
                  {pool.availableWhen === "challenge_completion" && !challengeActive && (
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
