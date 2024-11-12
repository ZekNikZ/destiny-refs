import { Container, Stack, Space, Group, Code, Text } from "@mantine/core";

export default function ErrorPage() {
  return (
    <Container size="xs">
      <Stack p="lg" align="center">
        <Space h="xl" />
        <Group gap="xs" align="flex-end">
          <Text ff="Bebas Neue" size="3rem">
            Destiny Refs
          </Text>
          <Text size="1.9rem" ff="Bebas Neue" c="blue" mb={4}>
            by ZekNikZ
          </Text>
        </Group>
        <Text c="red" fw="bold" ta="center">
          Error loading data from Bungie API.
        </Text>
        <Text ta="center">
          Try refreshing the page. If issue persists for several minutes, file an{" "}
          <a href="https://github.com/ZekNikZ/destiny-refs/issues/new"> issue on GitHub</a> or
          contact <Code>@zeknikz</Code> on Discord.
        </Text>
      </Stack>
    </Container>
  );
}
