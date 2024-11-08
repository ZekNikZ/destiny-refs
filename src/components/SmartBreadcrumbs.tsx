import { Breadcrumbs, Text } from "@mantine/core";
import { Link, useMatches } from "react-router-dom";

export default function SmartBreadcrumbs() {
  const data = useMatches();
  console.log(data);

  return (
    <Breadcrumbs>
      <Link to="/info">Loot & Details</Link>
      <Link to="/info/raids">Raids</Link>
      <Text>Salvation's Edge</Text>
    </Breadcrumbs>
  );
}
