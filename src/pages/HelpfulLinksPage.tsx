import { Title, Card, Group, Stack, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import {
  Axe,
  Backpack,
  ChartBar,
  FlagCheckered,
  Gavel,
  Info,
  Intersect,
  ListChecks,
  Medal,
  Newspaper,
  Ranking,
  Rewind,
  Sword,
  Trash,
  User,
  Users,
  UsersFour,
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
      <Card
        shadow="sm"
        padding="xs"
        radius="sm"
        withBorder
        w="min(180px, 44vw)"
        h="min(180px, 44vw)"
      >
        <Stack align="center" justify="center" gap="xs" h="100%">
          {props.icon}
          <Title size="h4" c="#fff" fw="bold" lh="xs" ta="center">
            {props.title}
          </Title>
        </Stack>
      </Card>
    </Link>
  );
}

export default function HelpfulLinksPage() {
  return (
    <Box maw={756} m="auto">
      <Stack>
        <Title order={2} size="h2">
          Spreadsheets
        </Title>
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
        </Group>
        <Title order={2} size="h2">
          Bungie
        </Title>
        <Group gap="sm" wrap="wrap">
          <LinkTile
            title="Bungie News"
            link="https://www.bungie.net/7/en/News"
            icon={makePhosphorIcon(Newspaper)}
          />
          <LinkTile
            title="Previous Season Pass"
            link="https://www.bungie.net/7/en/seasons/previousseason"
            icon={makePhosphorIcon(Rewind)}
          />
        </Group>

        <Title order={2} size="h2">
          Utilities
        </Title>
        <Group gap="sm" wrap="wrap">
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
            title="Destiny Recipes Checklist"
            link="https://destinyrecipes.com/checklist"
            icon={makePhosphorIcon(ListChecks)}
          />
        </Group>

        <Title order={2} size="h2">
          Reports
        </Title>
        <Group gap="sm" wrap="wrap">
          <LinkTile
            title="Raid Report"
            link="https://raid.report/"
            icon={makePhosphorIcon(UsersFour)}
          />
          <LinkTile
            title="Dungeon Report"
            link="https://dungeon.report/"
            icon={makePhosphorIcon(Users)}
          />
          <LinkTile
            title="Raid Hub"
            link="https://raidhub.io/"
            icon={makePhosphorIcon(UsersFour)}
          />
          <LinkTile
            title="Time Wasted on Destiny"
            link="https://wastedondestiny.com/"
            icon={makePhosphorIcon(Trash)}
          />
          <LinkTile
            title="Trials Report"
            link="https://destinytrialsreport.com/"
            icon={makePhosphorIcon(Axe)}
          />
          <LinkTile
            title="Crucible Report"
            link="https://crucible.report/"
            icon={makePhosphorIcon(Sword)}
          />
          <LinkTile
            title="Grandmaster Report"
            link="https://gm.report/"
            icon={makePhosphorIcon(Gavel)}
          />
          <LinkTile
            title="Emblems Report"
            link="https://emblems.report/"
            icon={makePhosphorIcon(Medal)}
          />
          <LinkTile
            title="Lowman Central"
            link="https://lowman-central.com/"
            icon={makePhosphorIcon(User)}
          />
        </Group>
      </Stack>
    </Box>
  );
}
