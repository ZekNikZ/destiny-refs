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
import { ActivityMeta, ActivityTag } from "../../data/types";

import classes from "./ActivityCard.module.scss";
import { useMemo, useState } from "react";
import { summarizeLootPool } from "../../utils/flatten-loot-table";
import LootIcon from "../loot/LootIcon";
import LootTable from "../loot/LootTable";

interface Props {
  meta: ActivityMeta;

  titlePrefix?: string;
  titleStyle?: "large" | "small";

  tags?: ActivityTag[];

  forceState?: "summary" | "details" | false;
}

export default function ActivityCard(props: Props) {
  const theme = useMantineTheme();

  const [collapseOpen, setCollapseOpen] = useState(props.forceState || "summary");
  const [accordionOpen, setAccordionOpen] = useState<string | null>(null);

  const lootSummary = useMemo(
    () => props.meta.loot?.flatMap(summarizeLootPool) ?? [],
    [props.meta.loot]
  );

  const toggleCollapseState = () => {
    setAccordionOpen(null);
    setCollapseOpen((state) => (state === "summary" ? "details" : "summary"));
  };

  return (
    <Card shadow="sm" padding="sm" radius="sm" withBorder>
      {/* Header */}
      <Card.Section
        className={classes.darkOverlay}
        mih={80}
        p="sm"
        style={{
          backgroundImage: `url('${props.meta.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
          borderBottom: `1px solid ${theme.colors.dark[4]}`,
        }}
      >
        <Stack gap="xs" style={{ position: "relative" }}>
          {/* Text */}
          <Stack gap={0}>
            {props.titleStyle === "large" ? (
              <Title size="h1" c="#fff" fw="bold" lh="xs">
                Salvation's Edge
              </Title>
            ) : (
              <Text size="lg" c="#fff" fw="bold" lh="xs">
                {props.titlePrefix}
                {props.meta.name}
              </Text>
            )}
            <Text lh="xs">{props.meta.description}</Text>
          </Stack>

          {/* Button */}
          {/* TODO: hide button if state is forced */}
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
          {/* TODO: properly do tags */}
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
            {props.meta.loot && (
              <Accordion.Item key="Loot" value="Loot">
                <Accordion.Control icon={<TreasureChest />}>Loot</Accordion.Control>
                <Accordion.Panel>
                  <LootTable lootPools={props.meta.loot} />
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* TODO: Triumphs */}
            {props.meta.triumphs && (
              <Accordion.Item key="Triumphs" value="Triumphs">
                <Accordion.Control icon={<Trophy />}>Triumphs</Accordion.Control>
                <Accordion.Panel>Triumphs</Accordion.Panel>
              </Accordion.Item>
            )}

            {/* TODO: Guides */}
            {props.meta.guides && (
              <Accordion.Item key="Guides" value="Guides">
                <Accordion.Control icon={<Question />}>Guides</Accordion.Control>
                <Accordion.Panel>Guides!</Accordion.Panel>
              </Accordion.Item>
            )}

            {/* TODO: Secret Chests */}
            {props.meta.secretChests && (
              <Accordion.Item key="Guides" value="Guides">
                <Accordion.Control icon={<Question />}>Guides</Accordion.Control>
                <Accordion.Panel>Secret Chests!</Accordion.Panel>
              </Accordion.Item>
            )}

            {/* TODO: Extra Puzzles */}
            {props.meta.extraPuzzles && (
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
