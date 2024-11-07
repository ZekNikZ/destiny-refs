import { Group, Image, Stack, Text } from "@mantine/core";
import { useBungieItemDetails, useBungieStaticData } from "../../utils/bungie-api";
import { Loot } from "../../data/types";
import LootIcon from "./LootIcon";

interface Props {
  loot: Loot;
}

export default function LootListing(props: Props) {
  const type = props.loot.type;

  const { data: item } = useBungieItemDetails(type === "item" ? props.loot.itemHash : 0);
  const { data: staticData } = useBungieStaticData();

  const name = type === "item" ? item?.displayProperties.name : props.loot.name;
  const damageType = type === "item" ? item?.defaultDamageType : undefined;
  const ammoType = type === "item" ? item?.equippingBlock?.ammoType : undefined;
  const classType = type === "item" ? item?.classType : undefined;
  const itemType = type === "item" ? item?.itemTypeDisplayName : props.loot.groupType;

  return (
    <Group gap="xs" w={300}>
      <LootIcon loot={props.loot} size={50} hideArtiface />
      <Stack gap={0}>
        <Text fw="bold">{name}</Text>
        <Group gap={4}>
          {damageType && damageType !== 0 && (
            <Image src={`https://bungie.net/${staticData?.damageTypes[damageType]?.icon}`} h={16} />
          )}
          {ammoType && ammoType !== 0 && (
            <Image src={`https://bungie.net/${staticData?.ammoTypes[ammoType]?.icon}`} h={12} />
          )}
          {props.loot.artiface && <Image src="/icons/attributes/artiface.png" h={16} />}
          <Text>
            {props.loot.artiface && "Artiface"}{" "}
            {classType !== undefined && classType !== 3 && staticData?.classes[classType].name}{" "}
            {itemType}
          </Text>
        </Group>
      </Stack>
    </Group>
  );
}
