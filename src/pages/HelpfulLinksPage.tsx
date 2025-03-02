import { Title, Card, Group, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import {
  Backpack,
  ChartBar,
  FlagCheckered,
  Info,
  Intersect,
  ListChecks,
  Newspaper,
  Ranking,
  Trash,
  type Icon,
} from "@phosphor-icons/react";

interface LinkData {
  title: string;
  link: string;
  icon: React.ReactNode;
}

function makePhosphorIcon(Icon: Icon) {
  return <Icon size={80} />;
}

function LinkTile(props: LinkData) {
  return (
    <Link to={props.link} style={{ textDecoration: "none" }} target="_blank">
      <Card shadow="sm" padding="xs" radius="sm" withBorder w={200} h={200}>
        <Stack align="center" justify="center" gap="xs" h="100%">
          {props.icon}
          <Title size="h3" c="#fff" fw="bold" lh="xs" ta="center">
            {props.title}
          </Title>
        </Stack>
      </Card>
    </Link>
  );
}

export default function HelpfulLinksPage() {
  return (
    <Group gap="sm" wrap="wrap">
      <LinkTile
        title="Data Compendium"
        link="https://docs.google.com/spreadsheets/d/1WaxvbLx7UoSZaBqdFr1u32F2uWVLo-CJunJB4nlGUE4/edit?gid=1038486120#gid=1038486120"
        icon={makePhosphorIcon(Info)}
      />
      <LinkTile
        title="Boss Damage Spreadsheet"
        link="https://docs.google.com/spreadsheets/d/1_5wtBjRYHHxuF4oJKDb_iOGZs-wTkzB6RYbnyNLbuz4/edit?gid=1313551887#gid=1313551887"
        icon={makePhosphorIcon(ChartBar)}
      />
      <LinkTile
        title="Endgame Tierlist Spreadsheet"
        link="https://docs.google.com/spreadsheets/d/1JM-0SlxVDAi-C6rGVlLxa-J1WGewEeL8Qvq4htWZHhY/edit?gid=867153635#gid=867153635"
        icon={makePhosphorIcon(Ranking)}
      />
      <LinkTile
        title="Buff/Debuff Stacking Spreadsheet"
        link="https://docs.google.com/spreadsheets/d/1i1KUwgVkd8qhwYj481gkV9sZNJQCE-C3Q-dpQutPCi4/edit?gid=242217075#gid=242217075"
        icon={makePhosphorIcon(Intersect)}
      />
      <LinkTile
        title="D2Checkpoint"
        link="https://d2checkpoint.com/"
        icon={makePhosphorIcon(FlagCheckered)}
      />
      <LinkTile
        title="Destiny Item Manager"
        link="https://app.destinyitemmanager.com"
        icon={makePhosphorIcon(Backpack)}
      />
      <LinkTile
        title="D2 Checklist"
        link="https://www.d2checklist.com/home"
        icon={makePhosphorIcon(ListChecks)}
      />
      <LinkTile
        title="Bungie News"
        link="https://www.bungie.net/7/en/News"
        icon={makePhosphorIcon(Newspaper)}
      />
      <LinkTile
        title="Time Wasted on Destiny"
        link="https://wastedondestiny.com/"
        icon={makePhosphorIcon(Trash)}
      />
    </Group>
  );
}
