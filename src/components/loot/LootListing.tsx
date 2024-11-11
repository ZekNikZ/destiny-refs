import { Group, Image, Stack, Text, Tooltip } from "@mantine/core";
import { useBungieItemDetails, useBungieStaticData } from "../../utils/bungie-api";
import { Loot } from "../../data/types";
import LootIcon from "./LootIcon";

interface Props {
  loot: Loot;
  noIcon?: boolean;
  fullWidth?: boolean;
  small?: boolean;
}

export default function LootListing(props: Props) {
  const type = props.loot.type;

  if (type === "ref-loot") {
    throw new Error("Cannot use a reference loot pool");
  }

  const { data: item } = useBungieItemDetails(type === "item" ? props.loot.itemHash : 0);
  const { data: staticData } = useBungieStaticData();

  const name = type === "item" ? item?.displayProperties.name : props.loot.name;
  const damageType = type === "item" ? item?.defaultDamageType : undefined;
  const ammoType = type === "item" ? item?.equippingBlock?.ammoType : undefined;
  const classType = type === "item" ? item?.classType : undefined;
  const itemType = type === "item" ? item?.itemTypeDisplayName : props.loot.groupType;

  return (
    <Group gap="xs" w={!props.noIcon && !props.fullWidth ? 300 : undefined} wrap="nowrap">
      {!props.noIcon && (
        <LootIcon
          loot={props.loot}
          size={props.small ? 30 : 50}
          hideArtiface
          disableHover
          hideQuantity={props.small}
        />
      )}
      <Stack gap={0}>
        {props.small ? (
          <Text size="sm">
            {name}
            <b>
              {props.loot.quantity && props.loot.quantity > 1
                ? ` \u00d7${props.loot.quantity}`
                : ""}
            </b>
          </Text>
        ) : (
          <>
            <Group gap={6}>
              <Text fw="bold">{name}</Text>
              {props.loot.deepsight && (
                <Tooltip
                  label={
                    props.loot.deepsight === "craftable"
                      ? "Craftable: drops have a chance to be deepsight"
                      : "Craftable: first drop each week is guaranteed to be deepsight"
                  }
                >
                  <Group gap={2}>
                    <Image src="/icons/attributes/shaped.svg" h={14} />
                    {/* {props.loot.deepsight === "craftable" ? (
                      <Percent size={16} color="#d25336" weight="bold" />
                    ) : (
                      <CheckFat size={16} color="#d25336" weight="fill" />
                    )} */}
                  </Group>
                </Tooltip>
              )}
            </Group>
            <Group gap={4}>
              {damageType && damageType !== 0 && (
                <Image
                  src={`https://bungie.net/${staticData?.damageTypes[damageType]?.icon}`}
                  h={16}
                />
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
          </>
        )}
      </Stack>
    </Group>
  );
}
