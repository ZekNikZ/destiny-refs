import { Group, Image, Stack, Text } from "@mantine/core";
import {
  useBungieItemDetails,
  useBungieSettings,
  useBungieStaticData,
} from "../../utils/bungie-api";
import LootItemIcon from "./LootItemIcon";

interface Props {
  itemHash: number;
  quantity?: number;
}

export default function LootItemListing(props: Props) {
  const { data: item } = useBungieItemDetails(props.itemHash);
  const { data: staticData } = useBungieStaticData();
  const { data: settings } = useBungieSettings();

  return (
    <Group key={props.itemHash} gap="xs" w={300}>
      <LootItemIcon itemHash={props.itemHash} quantity={props.quantity} size={50} />
      <Stack gap={0}>
        <Text fw="bold">{item?.displayProperties.name}</Text>
        <Group gap={4}>
          {item?.defaultDamageType && item?.defaultDamageType !== 0 && (
            <Image
              src={`https://bungie.net/${staticData?.damageTypes[item?.defaultDamageType].icon}`}
              h={16}
            />
          )}
          {item?.equippingBlock?.ammoType && item.equippingBlock.ammoType !== 0 && (
            <Image
              src={`https://bungie.net/${settings?.ammoIcons[item.equippingBlock.ammoType]}`}
              h={12}
            />
          )}
          <Text>
            {item?.classType !== undefined &&
              item.classType !== 3 &&
              staticData?.classes[item.classType].name}{" "}
            {item?.itemTypeDisplayName}
          </Text>
        </Group>
      </Stack>
    </Group>
  );
}
