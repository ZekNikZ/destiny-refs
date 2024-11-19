import { Activity, ActivityAvailability, ContentBlock } from "../../data/types";
import { Box, Card, Group, Stack, Title, useMantineTheme } from "@mantine/core";
import React from "react";

interface Props {
  activity: Activity;
  activityAvailability?: ActivityAvailability;
  contentBlock: Extract<ContentBlock, { type: "special-zero-hour-map" }>;
}

const MAPS = [
  {
    name: "Normal / Arc",
    color: "rgb(133, 197, 236)",
    map: "....X|XXX.X|X.XXX|X....|XXXX.|...X.",
  },
  {
    name: "Normal / Void",
    color: "rgb(177, 132, 197)",
    map: "X....|XXXXX|....X|XXX.X|X.XXX|X....",
  },
  {
    name: "Normal / Solar",
    color: "rgb(242, 114, 27)",
    map: "....X|XXXXX|X....|XXX..|..X..|..X..",
  },
  {
    name: "Expert / Arc",
    color: "rgb(133, 197, 236)",
    map: "X....|XXXX.|...X.|...X.|XXXX.|X....",
  },
  {
    name: "Expert / Void",
    color: "rgb(177, 132, 197)",
    map: "....X|XXX.X|X.X.X|X.XXX|X....|X....",
  },
  {
    name: "Expert / Solar",
    color: "rgb(242, 114, 27)",
    map: ".X...|.XXXX|....X|.XXXX|XX...|X....",
  },
];

export default function SpecialZeroHourMaps(_props: Props) {
  const theme = useMantineTheme();

  return (
    <Stack>
      <Group>
        {MAPS.map(({ name, color, map }) => (
          <Card key={name} withBorder style={{ flexGrow: 1, flexBasis: "200px", flexShrink: 0 }}>
            <Stack align="center">
              <Title order={4} size="h4" ta="center">
                {name}
              </Title>
              <Box
                style={{
                  gridTemplateColumns: "repeat(5, 30px)",
                  display: "grid",
                  border: `1px solid ${theme.colors.gray[6]}`,
                }}
              >
                {map.split("|").map((row, i) => (
                  <React.Fragment key={i}>
                    {row.split("").map((cell, j) => (
                      <Box
                        key={`${i}-${j}`}
                        h="30px"
                        w="30px"
                        bg={cell === "X" ? color : "black"}
                        style={{ border: `1px solid ${theme.colors.gray[6]}` }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </Box>
            </Stack>
          </Card>
        ))}
      </Group>
    </Stack>
  );
}
