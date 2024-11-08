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
import { useMemo, useState } from "react";
import { anyLootIsPinnacle, summarizeLootPool } from "../../utils/loot";
import LootIcon from "../loot/LootIcon";
import LootTable from "../loot/LootTable";

interface Props {
  activity: Activity;

  titlePrefix?: string;
  encounter?: boolean;

  availability?: ActivityAvailability;

  forceState?: "summary" | "details" | false;
}

export default function ActivityCard(props: Props) {
  const theme = useMantineTheme();

  const [collapseOpen, setCollapseOpen] = useState(props.forceState || "summary");
  const [accordionOpen, setAccordionOpen] = useState<string | null>(null);

  const lootSummary = useMemo(
    () => props.activity.loot?.flatMap(summarizeLootPool) ?? [],
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

  return (
    <Card shadow="sm" padding="sm" radius="sm" withBorder>
      {/* Header */}
      <Card.Section
        className={classes.darkOverlay}
        mih={80}
        p="sm"
        style={{
          backgroundImage: `url('${props.activity.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
          borderBottom: `1px solid ${theme.colors.dark[4]}`,
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
            <Text lh="xs">{props.activity.description}</Text>
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
            {props.availability?.featured === "farmable" && !isEncounter && (
              <Badge color="blue" radius="sm">
                Farmable
              </Badge>
            )}
            {props.availability?.featured === "farmable" && !isEncounter && (
              <Badge color="yellow" radius="sm">
                Featured
              </Badge>
            )}
            {props.availability?.masterAvailable && !isEncounter && (
              <Badge color="orange" radius="sm">
                Master Available
              </Badge>
            )}
            {props.availability?.challengeActive && isEncounter && (
              <Badge color="green" radius="sm">
                Challenge Active
              </Badge>
            )}
            {props.availability?.doubleLootActive && isEncounter && (
              <Badge color="blue" radius="sm">
                Double Loot Active
              </Badge>
            )}
            {pinnacleRewards && (
              <Badge color="pink" radius="sm">
                Pinnacle Rewards
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
                <LootIcon key={loot.type === "item" ? loot.itemHash : loot.name} loot={loot} />
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
                  <LootTable lootPools={props.activity.loot} availability={props.availability} />
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* TODO: Triumphs */}
            {props.activity.triumphs && (
              <Accordion.Item key="Triumphs" value="Triumphs">
                <Accordion.Control icon={<Trophy />}>Triumphs</Accordion.Control>
                <Accordion.Panel>Triumphs</Accordion.Panel>
              </Accordion.Item>
            )}

            {/* TODO: Guides */}
            {props.activity.guides && (
              <Accordion.Item key="Guides" value="Guides">
                <Accordion.Control icon={<Question />}>Guides</Accordion.Control>
                <Accordion.Panel>Guides!</Accordion.Panel>
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
