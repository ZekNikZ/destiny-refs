import { Container, Stack, Title, NativeSelect, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

export default function SettingsPage() {
  const [perkWebsite, setPerkWebsite] = useLocalStorage({
    key: "perk-website",
    defaultValue: "https://d2foundry.gg/w/",
  });

  return (
    <Container size="sm">
      <Stack>
        <Title ta="center">Settings</Title>
        <NativeSelect
          label="Loot Links"
          description="Choose which website to redirect to when clicking on loot item icons."
          color="blue"
          data={[
            { label: "d2foundry.gg", value: "https://d2foundry.gg/w/" },
            { label: "light.gg", value: "https://www.light.gg/db/items/" },
          ]}
          value={perkWebsite}
          onChange={(event) => setPerkWebsite(event.target.value)}
        />
        <Text c="gray.6" fs="italic">
          Debug hash: {import.meta.env.VITE_COMMIT_HASH}
        </Text>
      </Stack>
    </Container>
  );
}
