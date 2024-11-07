import { Activity, LootPool } from "../data/types";
import { Badge, Box, Breadcrumbs, Group, List, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import ActivityCard from "../components/activity/ActivityCard";

const exampleLootPool: LootPool = {
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
              type: "group",
              name: "Helmet (Class-Specific)",
              groupType: "Armor",
              displayStaticIcon: "helmet",
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
              name: "Leg Armor (Class-Specific)",
              groupType: "Armor",
              displayStaticIcon: "leg-armor",
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
          quantity: "all",
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
    {
      mode: "Master",
      bungieActivityHash: -1,
      children: [
        {
          type: "pool",
          quantity: 1,
          showInLootSummary: true,
          pinnacleWhen: "always",
          weeklyLimit: "once_per_character",
          availableWhen: "always",
          loot: [
            {
              type: "group",
              name: "Helmet (Class-Specific)",
              groupType: "Stat-Focused Armor",
              displayStaticIcon: "helmet",
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
              name: "Leg Armor (Class-Specific)",
              groupType: "Stat-Focused Armor",
              displayStaticIcon: "leg-armor",
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

const activity: Activity = {
  id: "raid-salvations-edge",
  type: "raid",
  name: "Salvation's Edge",
  backgroundImage: "/test-bg-img.webp",
  location: "Pale Heart, The Traveler",
  description: "Put the square into the square hole.",
  encounters: [
    {
      id: "encounter-salvations-edge-1",
      name: "Substratum",
      backgroundImage: "/test-bg-img.webp",
      description: "Put the square into the square hole.",
      loot: [exampleLootPool],
    },
  ],
};

const TodayPage = () => {
  return (
    <Stack>
      <Breadcrumbs>
        <Link to="/info">Loot & Details</Link>
        <Link to="/info/raids">Raids</Link>
        <Text>Salvation's Edge</Text>
      </Breadcrumbs>
      <ActivityCard titleStyle="large" meta={activity} />
      {activity.encounters.map((encounter, index) => (
        <ActivityCard
          key={encounter.name}
          titlePrefix={`Encounter ${index + 1}: `}
          meta={encounter}
        />
      ))}

      {/* TODO: remove */}
      <Box size="xl" />
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
  );
};

export default TodayPage;
