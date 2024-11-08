import { Activity, LootPool } from "../data/types";
import { Breadcrumbs, Group, Stack, Text } from "@mantine/core";
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
          quantity: 1,
          showInLootSummary: true,
          pinnacleWhen: "always",
          weeklyLimit: "once_per_character",
          availableWhen: "always",
          doubleLootWhen: "challenge_completion",
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
          quantity: 1,
          pinnacleWhen: "never",
          weeklyLimit: "once_per_character",
          availableWhen: "challenge_completion",
          knockout: true,
          loot: [
            {
              type: "item",
              itemHash: 3951511045,
            },
            {
              type: "item",
              itemHash: 172461430,
            },
            {
              type: "item",
              itemHash: 1039915310,
            },
            {
              type: "item",
              itemHash: 3123651616,
            },
            {
              type: "item",
              itemHash: 892183998,
            },
            {
              type: "item",
              itemHash: 2001697739,
            },
          ],
        },
        {
          type: "pool",
          quantity: "chance",
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
      type: "encounter",
      name: "Substratum",
      backgroundImage: "/test-bg-img.webp",
      description: "Play tic tac toe.",
      loot: [exampleLootPool],
    },
    {
      id: "encounter-salvations-edge-2",
      type: "encounter",
      name: "Dissipation",
      backgroundImage: "/test-bg-img.webp",
      description: "Taniks, again?",
      loot: [exampleLootPool],
    },
    {
      id: "encounter-salvations-edge-3",
      type: "encounter",
      name: "Repository",
      backgroundImage: "/test-bg-img.webp",
      description: "TORMENTORS!!!",
      loot: [exampleLootPool],
    },
    {
      id: "encounter-salvations-edge-4",
      type: "encounter",
      name: "Verity",
      backgroundImage: "/test-bg-img.webp",
      description: "Put the square into the square hole.",
      loot: [exampleLootPool],
    },
    {
      id: "encounter-salvations-edge-5",
      type: "encounter",
      name: "The Witness",
      backgroundImage: "/test-bg-img.webp",
      description: "Prevent the final shape.",
      loot: [exampleLootPool],
    },
  ],
};

const TodayPage = () => {
  const masterAvailable = true;
  const featured = "newest";
  const doubleLootActive = false;

  return (
    <Stack>
      <Breadcrumbs>
        <Link to="/info">Loot & Details</Link>
        <Link to="/info/raids">Raids</Link>
        <Text>Salvation's Edge</Text>
      </Breadcrumbs>
      <ActivityCard
        activity={activity}
        availability={{
          featured,
          masterAvailable,
          doubleLootActive,
        }}
      />
      <Group align="stretch">
        {activity.encounters?.map((encounter, index) => (
          <ActivityCard
            encounter
            key={encounter.name}
            titlePrefix={`Encounter ${index + 1}: `}
            activity={encounter}
            availability={{
              featured,
              challengeActive: index === 4,
              masterAvailable,
              doubleLootActive,
            }}
          />
        ))}
      </Group>
    </Stack>
  );
};

export default TodayPage;
