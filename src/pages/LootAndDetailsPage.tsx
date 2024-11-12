import { Card, Group, Title } from "@mantine/core";
import classes from "./LootAndDetailsPage.module.scss";
import { Link } from "react-router-dom";
import { activityTypes } from "../routes";

function LinkCard(props: { title: string; link: string; backgroundImage: string }) {
  return (
    <Link to={props.link} style={{ textDecoration: "none", flexGrow: 1 }}>
      <Card shadow="sm" padding="sm" radius="sm" withBorder>
        <Card.Section
          className={classes.darkOverlay}
          mih={120}
          miw={350}
          p="sm"
          style={{
            backgroundImage: `url('${props.backgroundImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          display="flex"
        >
          <Title size="h1" c="#fff" fw="bold" lh="xs" ta="center">
            {props.title}
          </Title>
        </Card.Section>
      </Card>
    </Link>
  );
}

export default function LootAndDetailsPage() {
  return (
    <Group>
      {activityTypes.map((activityType) => (
        <LinkCard
          key={activityType.type}
          title={activityType.title}
          link={`/info/${activityType.type}s`}
          backgroundImage={activityType.backgroundImage}
        />
      ))}
    </Group>
  );
}
