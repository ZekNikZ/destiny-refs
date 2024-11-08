import {
  Card,
  Group,
  Title,
  useMantineTheme,
  Text,
  Image,
  Stack,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { Triumph } from "../data/types";
import { useBungieRecordDetails } from "../utils/bungie-api";
import LootListing from "./loot/LootListing";
import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

interface Props {
  triumph: Triumph;
  parentChallengesActive?: boolean;
}

export default function TriumphDisplay(props: Props) {
  const theme = useMantineTheme();

  const { data: record, isSuccess } = useBungieRecordDetails(props.triumph.bungieRecordHash);

  const [spoilerOpen, setSpoilerOpen] = useState(false);

  return (
    <Card
      padding="xs"
      withBorder
      radius="xs"
      bg={theme.colors.dark[7]}
      style={{
        flexGrow: 1,
        flexBasis: "400px",
      }}
    >
      <Group align="start" wrap="nowrap">
        <Image
          src={isSuccess ? `https://bungie.net/${record?.displayProperties.icon}` : null}
          fallbackSrc="/icons/loot/loading.gif"
          w="50"
          h="50"
        />
        <Stack gap="xs">
          <Group>
            <Title size="h5">{record?.displayProperties?.name ?? "Loading"}</Title>
            {props.triumph.isChallenge &&
              (props.parentChallengesActive ? (
                <Badge color="green" radius="sm">
                  Active
                </Badge>
              ) : (
                <Badge color="red" radius="sm">
                  Not Active
                </Badge>
              ))}
          </Group>
          <Text>{record?.displayProperties?.description ?? "Loading"}</Text>
          {props.triumph.guide && (
            <Group gap="xs" wrap="nowrap" align="start">
              <ActionIcon
                variant="default"
                onClick={() => {
                  setSpoilerOpen((s) => !s);
                }}
              >
                {spoilerOpen ? <Eye /> : <EyeSlash />}
              </ActionIcon>
              {spoilerOpen ? (
                <Text fs="italic">{props.triumph.guide}</Text>
              ) : (
                <Text fs="italic">Click to show hint.</Text>
              )}
            </Group>
          )}
          {record?.rewardItems && (
            <Stack gap="xs">
              {record.rewardItems.map((item) => (
                <LootListing
                  small
                  fullWidth
                  loot={{ type: "item", itemHash: item.itemHash, quantity: item.quantity }}
                  key={item.itemHash}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Group>
    </Card>
  );
}
