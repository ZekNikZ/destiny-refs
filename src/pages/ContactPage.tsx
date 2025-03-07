import { Code, Container, Group, Stack, Text, Image, Divider } from "@mantine/core";
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
          <Group align="center" gap="xs" h={30}>
            <DiscordLogo weight="fill" size={20} /> Discord: <Code>@zeknikz</Code>
          </Group>
          <Group align="center" gap="xs" h={30}>
            <GithubLogo weight="fill" size={20} /> GitHub:
            <a href="https://github.com/ZekNikZ">
              <Code>@ZekNikZ</Code>
            </a>
          </Group>
          <Group align="center" gap="xs" h={30}>
            <Image
              src="/images/logos/destiny.svg"
              width={20}
              height={20}
              style={{ width: "20px" }}
            />
            Bungie:
            <Code>ZekNikZ#3085</Code>
          </Group>
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
        <Text>
          If you would like to support this project, you can{" "}
          <a href="https://ko-fi.com/zeknikz" target="_blank">
            buy me a coffee
          </a>
          . This website and its content are and will always be free of charge, but the website
          itself does cost money to operate. I greatly appreciate any and all support!
        </Text>

        <Divider my={15} />

        <Text fs="italic">
          This is a passion project of mine that has been over a year in the making. The goal of
          this website is to be an accurate, regularly-updated, and easy to use resource for Destiny
          players of all kinds. It came from a desire to have a single place that had up-to-date
          information that could be easily shared and accessed quickly (both in terms of pulling it
          up on a second monitor and actual site load speed). I've designed it in such a way to be
          the exact resource I've wanted all these years, and I hope that you find it as useful as I
          do! If not, I'm always open to suggestions and feedback. Enjoy!
        </Text>
        <Text fs="italic">- ZekNikZ</Text>

        <Divider my={15} />

        <Text fz={11} c="gray">
          Destiny 2 is a registered trademark of Bungie, Inc. All content and assets used on this
          website are the property of their respective owners. This website is not affiliated with,
          endorsed by, or officially connected to Bungie in any way. All trademarks, logos, and
          images are used for informational and fan purposes only under fair use. If you are a
          rights holder and believe any content infringes on your intellectual property, please
          contact us for prompt removal.
        </Text>
      </Stack>
    </Container>
  );
}
