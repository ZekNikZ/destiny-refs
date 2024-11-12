import {
  Card,
  Stack,
  Group,
  ActionIcon,
  Badge,
  Collapse,
  Accordion,
  useMantineTheme,
  Text,
  Title,
  TypographyStylesProvider,
  Box,
} from "@mantine/core";
import {
  ArrowsInSimple,
  ArrowsOutSimple,
  TreasureChest,
  Trophy,
  Question,
} from "@phosphor-icons/react";
import { Activity, ActivityAvailability } from "../../data/types";

import classes from "./ActivityCard.module.scss";
import React, { useMemo, useState } from "react";
import { anyLootIsPinnacle, dedupeLoot, getLootKey, summarizeLootPool } from "../../utils/loot";
import LootIcon from "../loot/LootIcon";
import LootTable from "../loot/LootTable";
import Markdown from "react-markdown";
import TriumphDisplay from "../TriumphDisplay";
import { useMediaQuery } from "@mantine/hooks";

interface Props {
  activity: Activity;

  titlePrefix?: string;
  encounter?: boolean;

  availability?: ActivityAvailability;

  forceState?: "summary" | "details" | false;

  style?: React.CSSProperties;
}

export default function ActivityCard(props: Props) {
  const theme = useMantineTheme();

  const [collapseOpen, setCollapseOpen] = useState(props.forceState || "summary");
  const [accordionOpen, setAccordionOpen] = useState<string | null>(null);

  const isLargeScreen = useMediaQuery("(min-width: 1000px)");

  const lootSummary = useMemo(
    () => dedupeLoot(props.activity.loot?.flatMap(summarizeLootPool) ?? []),
    [props.activity.loot]
  );

  const toggleCollapseState = () => {
    setAccordionOpen(null);
    setCollapseOpen((state) => (state === "summary" ? "details" : "summary"));
  };

  const isEncounter = !!props.encounter;
  const pinnacleRewards =
    anyLootIsPinnacle(props.activity.loot ?? [], !!props.availability?.featured) ||
    props.activity.encounters?.some((encounter) =>
      anyLootIsPinnacle(encounter.loot ?? [], !!props.availability?.featured)
    );
  const challengesActive =
    props.availability?.allChallengesActive ||
    props.availability?.activeChallenges?.includes(props.activity.id);

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="sm"
      withBorder
      style={{ ...props.style, ...(props.encounter ? { alignSelf: "start" } : undefined) }}
    >
      {/* Header */}
      <Card.Section
        className={classes.darkOverlay}
        mih={80}
        p="sm"
        style={{
          backgroundImage: `url('${props.activity.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
          borderBottom: (
            collapseOpen === "summary"
              ? lootSummary.length > 0
              : props.activity.loot ||
                props.activity.triumphs ||
                props.activity.guide ||
                props.activity.extraPuzzles
          )
            ? `1px solid ${theme.colors.dark[4]}`
            : undefined,
          flexGrow: 1,
        }}
      >
        <Stack gap="xs" style={{ position: "relative" }}>
          {/* Text */}
          <Stack gap={0}>
            {!isEncounter ? (
              <Title size="h1" c="#fff" fw="bold" lh="xs">
                {props.titlePrefix}
                {props.activity.name}
              </Title>
            ) : (
              <Text size="lg" c="#fff" fw="bold" lh="xs">
                {props.titlePrefix}
                {props.activity.name}
              </Text>
            )}
            <Text lh="xs">
              {props.activity.location ? `(${props.activity.location}) ` : ""}
              {props.activity.description}
            </Text>
          </Stack>

          {/* Button */}
          {!props.forceState && (
            <ActionIcon
              variant="default"
              size="md"
              onClick={() => toggleCollapseState()}
              style={{ position: "absolute", right: 0, top: 0 }}
            >
              {collapseOpen === "details" ? (
                <ArrowsInSimple size="70%" />
              ) : (
                <ArrowsOutSimple size="70%" />
              )}
            </ActionIcon>
          )}

          {/* Tags */}
          <Group gap="xs">
            {props.availability?.featured === "newest" && !isEncounter && (
              <Badge color="yellow" radius="sm">
                Newest
              </Badge>
            )}
            {props.availability?.featured === "active" && !isEncounter && (
              <Badge color="blue" radius="sm">
                Farmable
              </Badge>
            )}
            {props.availability?.masterAvailable && !isEncounter && (
              <Badge color="orange" radius="sm">
                Master Available
              </Badge>
            )}
            {challengesActive && isEncounter && (
              <Badge color="green" radius="sm">
                Challenge Active
              </Badge>
            )}
            {pinnacleRewards && (
              <Badge color="pink" radius="sm">
                Pinnacle Rewards
              </Badge>
            )}
            {props.availability?.doubleLootActive && (
              <Badge color="blue" radius="sm">
                Double Loot Active
              </Badge>
            )}
          </Group>
        </Stack>
      </Card.Section>

      {/* Body */}
      <Card.Section>
        {/* Loot Summary */}
        <Collapse in={collapseOpen === "summary"}>
          {lootSummary.length > 0 && (
            <Group gap="xs" p="xs">
              {lootSummary.map((loot) => (
                <LootIcon key={getLootKey(loot)} loot={loot} />
              ))}
            </Group>
          )}
        </Collapse>

        {/* Details */}
        <Collapse in={collapseOpen === "details"}>
          <Accordion
            radius={0}
            classNames={{ item: classes.accordianChild }}
            value={accordionOpen}
            onChange={setAccordionOpen}
          >
            {/* Loot */}
            {props.activity.loot && (
              <Accordion.Item key="Loot" value="Loot">
                <Accordion.Control icon={<TreasureChest />}>Loot</Accordion.Control>
                <Accordion.Panel>
                  <LootTable
                    lootPools={props.activity.loot}
                    availability={props.availability}
                    activity={props.activity}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* Triumphs */}
            {props.activity.triumphs && (
              <Accordion.Item key="Triumphs" value="Triumphs">
                <Accordion.Control icon={<Trophy />}>Triumphs</Accordion.Control>
                <Accordion.Panel>
                  <Box
                    display="grid"
                    style={{
                      gridTemplateColumns: `repeat(auto-fit, ${isLargeScreen ? "minmax(450px, 1fr)" : "1fr"})`,
                      gap: "var(--mantine-spacing-md)",
                    }}
                  >
                    {props.activity.triumphs.map((triumph) => (
                      <TriumphDisplay
                        triumph={triumph}
                        key={triumph.bungieRecordHash}
                        parentChallengesActive={challengesActive}
                      />
                    ))}
                  </Box>
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* Guides */}
            {props.activity.guide && (
              <Accordion.Item key="Guide" value="Guide">
                <Accordion.Control icon={<Question />}>Guide</Accordion.Control>
                <Accordion.Panel>
                  <TypographyStylesProvider>
                    <Markdown>{props.activity.guide}</Markdown>
                  </TypographyStylesProvider>
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* TODO: Secret Chests */}
            {props.activity.secretChests && (
              <Accordion.Item key="Guides" value="Guides">
                <Accordion.Control icon={<Question />}>Guides</Accordion.Control>
                <Accordion.Panel>Secret Chests!</Accordion.Panel>
              </Accordion.Item>
            )}

            {/* TODO: Extra Puzzles */}
            {props.activity.extraPuzzles && (
              <Accordion.Item key="Guides" value="Guides">
                <Accordion.Control icon={<Question />}>Guides</Accordion.Control>
                <Accordion.Panel>Extra Puzzles!</Accordion.Panel>
              </Accordion.Item>
            )}
          </Accordion>
        </Collapse>
      </Card.Section>
    </Card>
  );
}
