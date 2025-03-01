import { Title, Card, Group, Container, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import {
  Backpack,
  FlagCheckered,
  Info,
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
    <Container size="md">
      <Group gap="sm" wrap="wrap" justify="center">
        <LinkTile
          title="Data Compendium"
          link="https://docs.google.com/spreadsheets/d/1WaxvbLx7UoSZaBqdFr1u32F2uWVLo-CJunJB4nlGUE4/edit?gid=1038486120#gid=1038486120"
          icon={makePhosphorIcon(Info)}
        />
        <LinkTile
          title="Boss Damage"
          link="https://docs.google.com/spreadsheets/d/1_5wtBjRYHHxuF4oJKDb_iOGZs-wTkzB6RYbnyNLbuz4/edit?gid=1313551887#gid=1313551887"
          icon={makePhosphorIcon(Ranking)}
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
    </Container>
  );
}
