import { useEffect, useState } from "react";
import { testBungieApi } from "../utils/test";
import { LootPool } from "../data/types";
import { Group, Stack, Image, Text } from "@mantine/core";
import { BungieDamageTypes } from "../data/bungie-types";
import { settings } from "../utils/bungie";

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
          ],
        },
        {
          type: "pool",
          quantity: "chance",
          showInLootSummary: true,
          pinnacleWhen: "never",
          weeklyLimit: "infinite_after_first_clear",
          availableWhen: "always",
          loot: [
            {
              type: "item",
              itemHash: 1036972937,
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
  const [state, setState] = useState<Awaited<ReturnType<typeof testBungieApi>>[0]>([]);
  const [damageTypes, setDamageTypes] = useState<BungieDamageTypes>({});

  useEffect(() => {
    const fetcher = async () => {
      const [s, d] = await testBungieApi(example);
      setState(s);
      setDamageTypes(d);
    };
    fetcher();
  }, []);

  return (
    <Stack>
      {state.map((item) => (
        <Group key={item.name}>
          <div
            style={{
              width: 60,
              height: 60,
              position: "relative",
            }}
          >
            <Image src={`https://bungie.net/${item.icon}`} />
            {item.watermark && (
              <Image
                src={`https://bungie.net/${item.watermark}`}
                style={{ position: "absolute", left: 0, top: 0 }}
              />
            )}
            {item.quantity && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  background: "rgba(0, 0, 0, 0.4)",
                  height: 18,
                  display: "flex",
                  padding: "2px 6px",
                  color: "white",
                  lineHeight: "14px",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                {item.quantity}
              </div>
            )}
          </div>
          <Stack gap={2}>
            <Text fw="bold">{item.name}</Text>
            <Group gap={4}>
              {item.damageType !== 0 && (
                <Image src={`https://bungie.net/${damageTypes[item.damageType].icon}`} h={16} />
              )}
              {item.ammoType && item.ammoType !== 0 && (
                <Image src={`https://bungie.net/${settings!.ammoIcons[item.ammoType]}`} h={12} />
              )}
              <Text>{item.type}</Text>
            </Group>
          </Stack>
        </Group>
      ))}
    </Stack>
  );
};

export default TodayPage;
