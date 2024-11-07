import { useMemo } from "react";
import { flattenLootPoolIntoItemHashes } from "../utils/flatten-loot-table";
import { LootPool } from "../data/types";
import { Card, Group, Stack, Text } from "@mantine/core";
import LootItemListing from "../components/testing/LootItemListing";

import classes from "./TodayPage.module.scss";
import LootItemIcon from "../components/testing/LootItemIcon";

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

const TodayPage = () => {
  const itemHashes = useMemo(() => {
    return [...new Set(flattenLootPoolIntoItemHashes(example))];
  }, [example]);

  return (
    <Stack>
      <Card shadow="sm" padding="sm" radius="md" withBorder>
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
            <Text size="lg" c="#fff" fw="bold">
              Encounter 1: Verity
            </Text>
            <Text>Put the square into the square hole.</Text>
          </Stack>
        </Card.Section>
        <Card.Section p="xs">
          <Group>
            {itemHashes.map((itemHash) => (
              <LootItemIcon key={itemHash} itemHash={itemHash} />
            ))}
          </Group>
        </Card.Section>
      </Card>
      {itemHashes.map((itemHash) => (
        <LootItemListing key={itemHash} itemHash={itemHash} />
      ))}
    </Stack>
  );
};

export default TodayPage;
