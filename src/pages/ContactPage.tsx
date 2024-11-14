import { Code, Container, Group, List, Stack, Text, Image } from "@mantine/core";
import { DiscordLogo, GithubLogo } from "@phosphor-icons/react";

export default function ContactPage() {
  return (
    <Container size="sm">
      <Stack>
        <Group gap="xs" align="flex-end" style={{ alignSelf: "center" }}>
          <Text ff="Bebas Neue" size="3rem">
            Destiny Refs
          </Text>
          <Text size="1.9rem" ff="Bebas Neue" c="blue" mb={4}>
            by ZekNikZ
          </Text>
        </Group>
        <Text>
          This website is created and maintained by ZekNikZ. You can find him at the following:
          <List>
            <List.Item>
              <Group align="center" gap="xs">
                <DiscordLogo weight="fill" /> Discord: <Code>@zeknikz</Code>
              </Group>
            </List.Item>
            <List.Item>
              <Group align="center" gap="xs">
                <GithubLogo weight="fill" /> GitHub:
                <a href="https://github.com/ZekNikZ">
                  <Code>@ZekNikZ</Code>
                </a>
              </Group>
            </List.Item>
            <List.Item>
              <Group align="center" gap="xs">
                <Image
                  src="/images/logos/destiny.svg"
                  width={16}
                  height={16}
                  style={{ width: "16px" }}
                />
                Bungie:
                <Code>ZekNikZ#3085</Code>
              </Group>
            </List.Item>
          </List>
        </Text>
        <Text>
          If you find any issues (including incorrect loot tables or inaccurate information) or have
          suggestions, please file an{" "}
          <a href="https://github.com/ZekNikZ/destiny-refs/issues/new"> issue on GitHub</a> or
          contact <Code>@zeknikz</Code> on Discord. If describing an inaccuracy, please provide
          screenshots/videos to support your claim where possible.
        </Text>
        <Text>
          If you are a developer and would like to contribute, feel free to{" "}
          <a href="https://github.com/ZekNikZ/destiny-refs/pulls"> open a pull request</a>. I'll
          gladly accept the help!
        </Text>
      </Stack>
    </Container>
  );
}
