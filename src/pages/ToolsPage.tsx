import { Title, Card, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import routes from "../routes";
import classes from "./ToolsPage.module.scss";

function LinkCard(props: { title: string; link: string; backgroundImage: string }) {
  return (
    <Link to={props.link} style={{ textDecoration: "none", flexGrow: 1, flexBasis: "500px" }}>
      <Card shadow="sm" padding="sm" radius="sm" withBorder>
        <Card.Section
          className={classes.darkOverlay}
          mih={120}
          p="sm"
          style={{
            backgroundImage: `url('${props.backgroundImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
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

export default function ToolsPage() {
  return (
    <Group>
      {routes
        .find((route) => route.path === "/tools")
        ?.children?.filter((route) => !route.navbarProperties?.hidden)
        .map((route) => (
          <LinkCard
            key={route.path}
            title={route.title}
            link={route.path}
            backgroundImage={route.displayProperties?.backgroundImage ?? ""}
          />
        ))}
    </Group>
  );
}
