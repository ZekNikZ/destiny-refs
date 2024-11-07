import { useMemo, useState } from "react";
import { flattenLootPoolIntoItemHashes } from "../utils/flatten-loot-table";
import { Loot, LootPool } from "../data/types";
import {
  Accordion,
  ActionIcon,
  Badge,
  Breadcrumbs,
  Card,
  Collapse,
  Group,
  List,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import classes from "./TodayPage.module.scss";
import { Link } from "react-router-dom";
import {
  ArrowsInSimple,
  ArrowsOutSimple,
  CaretDown,
  Question,
  TreasureChest,
  Trophy,
} from "@phosphor-icons/react";
import LootItemIcon from "../components/loot/LootItemIcon";
import LootIcon from "../components/loot/LootIcon";
import LootListing from "../components/loot/LootListing";

const example: LootPool = {
  type: "mode_specific",
  modes: [
    {
      mode: "Normal",
      bungieActivityHash: -1,
      children: [
        {
          type: "pool",
          quantity: 2,
          showInLootSummary: true,
          pinnacleWhen: "always",
          weeklyLimit: "once_per_character",
          availableWhen: "always",
          loot: [
            {
              type: "item",
              itemHash: 859869931,
            },
            {
              type: "item",
              itemHash: 445197843,
            },
            {
              type: "item",
              itemHash: 3569407878,
            },
            {
              type: "item",
              itemHash: 2001697739,
            },
            {
              type: "group",
              name: "Head Armor",
              groupType: "head",
              children: [
                {
                  type: "item",
                  itemHash: 659074261,
                },
                {
                  type: "item",
                  itemHash: 1026610441,
                },
                {
                  type: "item",
                  itemHash: 930168404,
                },
              ],
            },
            {
              type: "group",
              name: "Leg Armor",
              groupType: "head",
              children: [
                {
                  type: "item",
                  itemHash: 1265563470,
                },
                {
                  type: "item",
                  itemHash: 1807926458,
                },
                {
                  type: "item",
                  itemHash: 7338415,
                },
              ],
            },
          ],
        },
        {
          type: "pool",
          quantity: "chance",
          showInLootSummary: true,
          pinnacleWhen: "never",
          weeklyLimit: "once_per_character",
          availableWhen: "always",
          loot: [
            {
              type: "item",
              itemHash: 3284383335,
            },
          ],
        },
        {
          type: "pool",
          quantity: 1,
          showInLootSummary: true,
          pinnacleWhen: "never",
          weeklyLimit: "infinite_after_first_clear",
          availableWhen: "always",
          loot: [
            {
              type: "item",
              itemHash: 3702027555,
              quantity: 5,
            },
            {
              type: "item",
              itemHash: 1036972937,
            },
            {
              type: "item",
              itemHash: 3727270518,
            },
            {
              type: "item",
              itemHash: 122307549,
            },
          ],
        },
      ],
    },
    {
      mode: "Master",
      bungieActivityHash: -1,
      children: [
        {
          type: "pool",
          quantity: 2,
          showInLootSummary: true,
          pinnacleWhen: "always",
          weeklyLimit: "once_per_character",
          availableWhen: "always",
          loot: [
            {
              type: "group",
              name: "Focused Head Armor",
              groupType: "head",
              children: [
                {
                  type: "item",
                  itemHash: 659074261,
                },
                {
                  type: "item",
                  itemHash: 1026610441,
                },
                {
                  type: "item",
                  itemHash: 930168404,
                },
              ],
            },
            {
              type: "group",
              name: "Focused Leg Armor",
              groupType: "head",
              children: [
                {
                  type: "item",
                  itemHash: 1265563470,
                },
                {
                  type: "item",
                  itemHash: 1807926458,
                },
                {
                  type: "item",
                  itemHash: 7338415,
                },
              ],
            },
          ],
        },
        {
          type: "pool",
          quantity: "chance",
          showInLootSummary: true,
          pinnacleWhen: "never",
          weeklyLimit: "once_per_character",
          availableWhen: "always",
          loot: [
            {
              type: "item",
              itemHash: 3284383335,
            },
          ],
        },
        {
          type: "pool",
          quantity: 1,
          showInLootSummary: true,
          pinnacleWhen: "never",
          weeklyLimit: "infinite_after_first_clear",
          availableWhen: "always",
          loot: [
            {
              type: "item",
              itemHash: 3702027555,
              quantity: 5,
            },
          ],
        },
      ],
    },
  ],
};

const exampleGroup: Loot = {
  type: "group",
  name: "Helmet (Class-Specific)",
  groupType: "Armor",
  displayStaticIcon: "helmet",
  artiface: true,
  children: [
    {
      type: "item",
      itemHash: 659074261,
    },
    {
      type: "item",
      itemHash: 1026610441,
    },
    {
      type: "item",
      itemHash: 930168404,
    },
  ],
};

const TodayPage = () => {
  const itemHashes = useMemo(() => {
    return [...new Set(flattenLootPoolIntoItemHashes(example))];
  }, [example]);

  const theme = useMantineTheme();

  const [open, setOpen] = useState(false);

  return (
    <Stack>
      <Breadcrumbs>
        <Link to="/info">Loot & Details</Link>
        <Link to="/info/raids">Raids</Link>
        <Text>Salvation's Edge</Text>
      </Breadcrumbs>
      <Card shadow="sm" padding="sm" radius="sm" withBorder>
        <Card.Section
          className={classes.darkOverlay}
          mih={80}
          p="sm"
          style={{
            backgroundImage: "url('/test-bg-img.webp')",
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
          }}
        >
          <Stack gap={0}>
            <Title size="h1" c="#fff" fw="bold" lh="xs">
              Salvation's Edge
            </Title>
            <Text lh="xs">Put the square into the square hole.</Text>
            <Group gap="xs" mt="xs">
              <Badge color="yellow" radius="sm">
                Newest
              </Badge>
              <Badge color="orange" radius="sm">
                Master Available
              </Badge>
              <Badge color="pink" radius="sm">
                Pinnacle Rewards
              </Badge>
            </Group>
          </Stack>
        </Card.Section>
        {/* <Card.Section p="xs">
          <Group gap="xs">
            {itemHashes.map((itemHash) => (
              <LootItemIcon key={itemHash} itemHash={itemHash} quantity={5} />
            ))}
          </Group>
        </Card.Section> */}
      </Card>
      <Card shadow="sm" padding="sm" radius="sm" withBorder>
        <Card.Section
          className={classes.darkOverlay}
          mih={80}
          p="sm"
          style={{
            backgroundImage: "url('/test-bg-img.webp')",
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
          }}
        >
          <Stack gap="xs">
            <Group justify="space-between">
              <Stack gap={0}>
                <Text size="lg" c="#fff" fw="bold" lh="xs">
                  Encounter 1: Substratum
                </Text>
                <Text lh="xs">Tic tac toe.</Text>
              </Stack>
              <ActionIcon variant="default" size="md">
                <CaretDown size="70%" />
              </ActionIcon>
            </Group>
            <Group gap="xs">
              <Badge color="green" radius="sm">
                Challenge Active
              </Badge>
            </Group>
          </Stack>
        </Card.Section>
        <Card.Section p="xs">
          <Group gap="xs">
            {/* {itemHashes.slice(0, 5).map((itemHash) => (
              <LootItemIcon key={itemHash} itemHash={itemHash} quantity={5} size={60} />
            ))} */}
            <LootIcon loot={exampleGroup} />
            <LootListing loot={exampleGroup} />
          </Group>
        </Card.Section>
      </Card>
      <Card shadow="sm" padding="sm" radius="sm" withBorder>
        <Card.Section
          className={classes.darkOverlay}
          mih={80}
          p="sm"
          style={{
            backgroundImage: "url('/test-bg-img.webp')",
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
            borderBottom: `1px solid ${theme.colors.dark[4]}`,
          }}
        >
          <Stack gap="xs">
            <Group justify="space-between">
              <Stack gap={0}>
                <Text size="lg" c="#fff" fw="bold" lh="xs">
                  Encounter 2: Dissipation
                </Text>
                <Text lh="xs">Tic tac toe.</Text>
              </Stack>
              <ActionIcon variant="default" size="md" onClick={() => setOpen((o) => !o)}>
                {open ? <ArrowsInSimple size="70%" /> : <ArrowsOutSimple size="70%" />}
              </ActionIcon>
            </Group>
            <Group gap="xs">
              <Badge color="green" radius="sm">
                Challenge Active
              </Badge>
              <Badge color="pink" radius="sm">
                Pinnacle Rewards
              </Badge>
            </Group>
          </Stack>
        </Card.Section>
        <Card.Section>
          <Collapse in={!open}>
            <Group gap="xs" p="xs">
              {/* {itemHashes.slice(0, 5).map((itemHash) => (
                <LootItemIcon key={itemHash} itemHash={itemHash} quantity={5} size={60} />
              ))} */}
            </Group>
          </Collapse>
          <Collapse in={open}>
            <Accordion radius={0}>
              <Accordion.Item key="Loot" value="Loot">
                <Accordion.Control icon={<TreasureChest />}>Loot</Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs">
                    <Card padding="xs" withBorder bg={theme.colors.dark[7]}>
                      <Stack gap="sm">
                        <Group gap="sm">
                          <Text size="md" fw="bold" fs="italic">
                            ONE OF
                          </Text>
                          <Badge color="blue" radius="sm">
                            Double Loot Active
                          </Badge>
                          <Badge color="red" radius="sm">
                            Not available this week
                          </Badge>
                        </Group>
                        <Group gap="xs">
                          {/* {itemHashes.slice(0, 10).map((itemHash) => (
                            <LootListing key={itemHash} itemHash={itemHash} />
                          ))} */}
                        </Group>
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
                    <Card padding="xs" withBorder bg={theme.colors.dark[7]}>
                      <Text size="md" mb="sm" fw="bold" fs="italic">
                        CHANCE FOR
                      </Text>
                      <Stack gap="xs">
                        {/* {itemHashes.slice(10, 11).map((itemHash) => (
                          <LootListing key={itemHash} itemHash={itemHash} />
                        ))} */}
                      </Stack>
                    </Card>
                    <Card padding="xs" withBorder bg={theme.colors.dark[7]}>
                      <Text size="md" mb="sm" fw="bold" fs="italic">
                        GUARANTEED
                      </Text>
                      <Stack gap="xs">
                        {/* {itemHashes.slice(11, 12).map((itemHash) => (
                          <LootListing key={itemHash} itemHash={itemHash} quantity={5} />
                        ))} */}
                      </Stack>
                    </Card>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item key="Triumphs" value="Triumphs">
                <Accordion.Control icon={<Trophy />}>Triumphs</Accordion.Control>
                <Accordion.Panel>Loooot!</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item key="Guides" value="Guides">
                <Accordion.Control icon={<Question />}>Guides</Accordion.Control>
                <Accordion.Panel>Loooot!</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Collapse>
        </Card.Section>
      </Card>
      <Card shadow="sm" padding="sm" radius="sm" withBorder>
        <Card.Section
          className={classes.darkOverlay}
          mih={80}
          p="sm"
          style={{
            backgroundImage: "url('/test-bg-img.webp')",
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
          }}
        >
          <Stack gap={0}>
            <Text size="lg" c="#fff" fw="bold" lh="xs">
              Encounter 1: Verity
            </Text>
            <Text lh="xs">Put the square into the square hole.</Text>
            <Group gap="xs" mt="xs">
              <Badge color="yellow" radius="sm">
                Newest
              </Badge>
              <Badge color="orange" radius="sm">
                Master Available
              </Badge>
              <Badge color="pink" radius="sm">
                Pinnacle Rewards
              </Badge>
              <Badge color="green" radius="sm">
                All Challenges Active
              </Badge>
              <Badge color="green" radius="sm">
                Challenge Active
              </Badge>
              <Badge color="blue" radius="sm">
                Double Loot Active
              </Badge>
              <Badge color="blue" radius="sm">
                Farmable
              </Badge>
              <Badge color="red" radius="sm">
                Not Available this week
              </Badge>
            </Group>
          </Stack>
        </Card.Section>
        <Card.Section p="xs">
          <Group gap="xs">
            {/* {itemHashes.map((itemHash) => (
              <LootItemIcon key={itemHash} itemHash={itemHash} quantity={5} size={60} />
            ))} */}
          </Group>
        </Card.Section>
      </Card>
      <Card padding="xs" withBorder bg={theme.colors.dark[7]}>
        <Group mb="sm" gap="sm">
          <Text size="md" fw="bold" fs="italic">
            ONE OF
          </Text>
          <Badge color="blue" radius="sm">
            Double Loot Active
          </Badge>
        </Group>
        <Stack gap="xs">
          {/* {itemHashes.slice(0, 10).map((itemHash) => (
            <LootListing key={itemHash} itemHash={itemHash} />
          ))} */}
        </Stack>
      </Card>
      <Card padding="xs" withBorder>
        <Text size="md" mb="sm" fw="bold" fs="italic">
          CHANCE FOR
        </Text>
        <Stack gap="xs">
          {/* {itemHashes.slice(10, 11).map((itemHash) => (
            <LootListing key={itemHash} itemHash={itemHash} />
          ))} */}
        </Stack>
      </Card>
      <Card padding="xs" withBorder>
        <Text size="md" mb="sm" fw="bold" fs="italic">
          GUARANTEED
        </Text>
        <Stack gap="xs">
          {/* {itemHashes.slice(11, 12).map((itemHash) => (
            <LootListing key={itemHash} itemHash={itemHash} />
          ))} */}
        </Stack>
      </Card>
      <Card padding="xs" withBorder>
        <Text size="md" mb="sm" fw="bold" fs="italic">
          CHANCE FOR
        </Text>
        <Stack gap="xs">
          {/* {itemHashes.slice(12).map((itemHash) => (
            <LootListing key={itemHash} itemHash={itemHash} />
          ))} */}
        </Stack>
      </Card>
    </Stack>
  );
};

export default TodayPage;
