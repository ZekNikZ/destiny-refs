import { Accordion, Group, Stack, Switch, Title, Text, ActionIcon } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import classes from "./VerityCalculator.module.scss";
import { Trash } from "@phosphor-icons/react";

type Pair<T extends string> = `${T}${T}`;

type Shape = "T" | "C" | "S" | undefined;
type ShapePair = Pair<NonNullable<Shape>> | undefined;

const sides = ["Left", "Middle", "Right"] as const;

function Callout(props: {
  inside: Shape[];
  outside?: ShapePair[];
  onChangeInside: React.Dispatch<React.SetStateAction<Shape[]>>;
  onChangeOutside?: React.Dispatch<React.SetStateAction<ShapePair[]>>;
}) {
  const [shapeIcons] = useLocalStorage({
    key: "verity-tool-shape-icons",
    defaultValue: true,
  });

  function setInside(slot: number, value: Shape) {
    props.onChangeInside((inside) => {
      if (inside[slot] === value) {
        inside[slot] = undefined;
        return [...inside];
      } else if (inside.includes(value)) {
        return [...inside];
      } else {
        inside[slot] = value;
        return [...inside];
      }
    });
  }

  return (
    <Stack gap="xs">
      <Group>
        <Title order={4} flex={1}>
          Inside
        </Title>
        <ActionIcon
          variant="default"
          onClick={() => props.onChangeInside([undefined, undefined, undefined])}
        >
          <Trash />
        </ActionIcon>
      </Group>
      <Group align="center" gap={0}>
        {sides.map((side, i) => (
          <Stack key={side + props.inside[i]} className={classes.calloutSection}>
            <Title order={5}>{side}</Title>
            <Group gap={2}>
              <ActionIcon
                variant="filled"
                color={props.inside[i] === "T" ? "blue" : "gray"}
                disabled={
                  (props.inside[i] && props.inside[i] !== "T") ||
                  props.inside.some((v, j) => j !== i && v === "T")
                }
                size="60px"
                onClick={() => setInside(i, "T")}
              >
                T
              </ActionIcon>
              <ActionIcon
                variant="filled"
                color={props.inside[i] === "C" ? "blue" : "gray"}
                disabled={
                  (props.inside[i] && props.inside[i] !== "C") ||
                  props.inside.some((v, j) => j !== i && v === "C")
                }
                size="60px"
                onClick={() => setInside(i, "C")}
              >
                C
              </ActionIcon>
              <ActionIcon
                variant="filled"
                color={props.inside[i] === "S" ? "blue" : "gray"}
                disabled={
                  (props.inside[i] && props.inside[i] !== "S") ||
                  props.inside.some((v, j) => j !== i && v === "S")
                }
                size="60px"
                onClick={() => setInside(i, "S")}
              >
                S
              </ActionIcon>
            </Group>
          </Stack>
        ))}
      </Group>
      {props.outside && (
        <>
          <Group>
            <Title order={4} flex={1}>
              Outside
            </Title>
            <ActionIcon
              variant="default"
              onClick={() => props.onChangeOutside?.([undefined, undefined, undefined])}
            >
              <Trash />
            </ActionIcon>
          </Group>
          <Group align="center" gap={0}>
            {sides.map((side, i) => (
              <Stack className={classes.calloutSection} align="center" pt="xs" pb="xs" gap="xs">
                <Title order={5}>{side}</Title>
                <Group gap={2}>
                  <ActionIcon variant="default" size="60px">
                    TT
                  </ActionIcon>
                  <ActionIcon variant="default" size="60px">
                    CC
                  </ActionIcon>
                  <ActionIcon variant="default" size="60px">
                    SS
                  </ActionIcon>
                  <ActionIcon variant="default" size="60px">
                    TC
                  </ActionIcon>
                  <ActionIcon variant="default" size="60px">
                    CS
                  </ActionIcon>
                  <ActionIcon variant="default" size="60px">
                    TS
                  </ActionIcon>
                </Group>
              </Stack>
            ))}
          </Group>
        </>
      )}
    </Stack>
  );
}

export default function VerityCalculator() {
  const [challengeRound, setChallengeRound] = useLocalStorage({
    key: "verity-tool-challenge-round",
    defaultValue: false,
  });
  const [speedrunMethod, setSpeedrunMethod] = useLocalStorage({
    key: "verity-tool-speedrun-method",
    defaultValue: false,
  });
  const [shapeIcons, setShapeIcons] = useLocalStorage({
    key: "verity-tool-shape-icons",
    defaultValue: true,
  });

  const [inside, setInside] = useState<Shape[]>([undefined, undefined, undefined]);
  const [outside, setOutside] = useState<ShapePair[]>([undefined, undefined, undefined]);

  return (
    <Stack w={600}>
      <Title order={2} ta="center" mt="md">
        Calculator
      </Title>
      <Accordion
        defaultValue="outside"
        style={{
          borderTop: "1px solid var(--mantine-color-dark-4)",
        }}
      >
        <Accordion.Item value="outside">
          <Accordion.Control>Outside Room</Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Group>
                <Switch
                  label="Use shape icons"
                  checked={shapeIcons}
                  onChange={(event) => setShapeIcons(event.target.checked)}
                />
                <Switch
                  label="Challenge modifier"
                  checked={challengeRound}
                  onChange={(event) => setChallengeRound(event.target.checked)}
                />
              </Group>
              <Callout
                inside={inside}
                onChangeInside={setInside}
                outside={outside}
                onChangeOutside={setOutside}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="inside">
          <Accordion.Control>Inside Room</Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Group>
                <Switch
                  label="Use shape icons"
                  checked={shapeIcons}
                  onChange={(event) => setShapeIcons(event.target.checked)}
                />
                <Switch
                  label="Challenge modifier"
                  checked={challengeRound}
                  onChange={(event) => setChallengeRound(event.target.checked)}
                />
                <Switch
                  label="Min swaps method"
                  checked={speedrunMethod}
                  onChange={(event) => setSpeedrunMethod(event.target.checked)}
                />
              </Group>
              <Callout inside={inside} onChangeInside={setInside} />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
