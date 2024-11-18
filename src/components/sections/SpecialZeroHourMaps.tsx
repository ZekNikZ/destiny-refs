import Markdown from "react-markdown";
import { Activity, ActivityAvailability, ContentBlock } from "../../data/types";
import { Card, Group, Stack, Title, TypographyStylesProvider } from "@mantine/core";

interface Props {
  activity: Activity;
  activityAvailability?: ActivityAvailability;
  contentBlock: Extract<ContentBlock, { type: "special-zero-hour-map" }>;
}

const MAPS = [
  {
    name: "Normal / Arc",
    map: "....X|XXX.X|X.XXX|X...|XXX.|...X.",
  },
  {
    name: "Normal / Void",
    map: "X....|XXXXX|....X|XXX.X|X.XXX|X....",
  },
];

export default function SpecialZeroHourMaps(_props: Props) {
  // TODO: remove
  console.log(MAPS);

  return (
    <Stack>
      <Group>
        <Card withBorder style={{ flexGrow: 1, flexBasis: "200px" }}>
          <Title order={4} size="h4" ta="center">
            Normal / Arc
          </Title>
        </Card>
        <Card withBorder style={{ flexGrow: 1, flexBasis: "200px" }}>
          <Title order={4} size="h4" ta="center">
            Normal / Void
          </Title>
        </Card>
        <Card withBorder style={{ flexGrow: 1, flexBasis: "200px" }}>
          <Title order={4} size="h4" ta="center">
            Normal / Solar
          </Title>
        </Card>
      </Group>
      <TypographyStylesProvider>
        <Markdown>
          {`    Normal (Arc, Void, Solar)
    ⬛⬛⬛⬛🟦 🟪⬛⬛⬛⬛ ⬛⬛⬛⬛🟧
    🟦🟦🟦⬛🟦 🟪🟪🟪🟪🟪 🟧🟧🟧🟧🟧
    🟦⬛🟦🟦🟦 ⬛⬛⬛⬛🟪 🟧⬛⬛⬛⬛
    🟦⬛⬛⬛⬛ 🟪🟪🟪⬛🟪 🟧🟧🟧⬛⬛
    🟦🟦🟦🟦⬛ 🟪⬛🟪🟪🟪 ⬛⬛🟧⬛⬛
    ⬛⬛⬛🟦⬛ 🟪⬛⬛⬛⬛ ⬛⬛🟧⬛⬛

    Legend (Arc, Void, Solar)
    🟦⬛⬛⬛⬛ ⬛⬛⬛⬛🟪 ⬛🟧⬛⬛⬛
    🟦🟦🟦🟦⬛ 🟪🟪🟪⬛🟪 ⬛🟧🟧🟧🟧
    ⬛⬛⬛🟦⬛ 🟪⬛🟪⬛🟪 ⬛⬛⬛⬛🟧
    ⬛⬛⬛🟦⬛ 🟪⬛🟪🟪🟪 ⬛🟧🟧🟧🟧
    🟦🟦🟦🟦⬛ 🟪⬛⬛⬛⬛ 🟧🟧⬛⬛⬛
    🟦⬛⬛⬛⬛ 🟪⬛⬛⬛⬛ 🟧⬛⬛⬛⬛`}
        </Markdown>
      </TypographyStylesProvider>
    </Stack>
  );
}
