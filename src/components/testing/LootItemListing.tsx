import { Group, Image, Stack, Text } from "@mantine/core";
import {
  useBungieDamageTypes,
  useBungieItemDetails,
  useBungieSettings,
} from "../../utils/bungie-api";

interface Props {
  itemHash: number;
  quantity?: number;
}

const LootItemListing = (props: Props) => {
  const { data: item } = useBungieItemDetails(props.itemHash);
  const { data: damageTypes } = useBungieDamageTypes();
  const { data: settings } = useBungieSettings();

  return (
    <Group key={props.itemHash}>
      <div
        style={{
          width: 60,
          height: 60,
          position: "relative",
        }}
      >
        <Image src={`https://bungie.net/${item?.displayProperties.icon}`} />
        {item?.iconWatermark && (
          <Image
            src={`https://bungie.net/${item.iconWatermark}`}
            style={{ position: "absolute", left: 0, top: 0 }}
          />
        )}
        {props.quantity && (
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.4)",
              height: 18,
              display: "flex",
              padding: "2px 6px",
              color: "white",
              lineHeight: "14px",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "14px",
            }}
          >
            {props.quantity}
          </div>
        )}
      </div>
      <Stack gap={2}>
        <Text fw="bold">{item?.displayProperties.name}</Text>
        <Group gap={4}>
          {item?.defaultDamageType && item?.defaultDamageType !== 0 && (
            <Image
              src={`https://bungie.net/${damageTypes?.[item?.defaultDamageType].icon}`}
              h={16}
            />
          )}
          {item?.equippingBlock.ammoType && item.equippingBlock.ammoType !== 0 && (
            <Image
              src={`https://bungie.net/${settings?.ammoIcons[item.equippingBlock.ammoType]}`}
              h={12}
            />
          )}
          <Text>{item?.itemTypeDisplayName}</Text>
        </Group>
      </Stack>
    </Group>
  );
};

export default LootItemListing;
