import { HoverCard, HoverCardDropdown, Image } from "@mantine/core";
import { useBungieItemDetails } from "../../utils/bungie-api";
import { Loot } from "../../data/types";
import LootListing from "./LootListing";

interface Props {
  loot: Extract<Loot, { type: "item" }>;
  size: number;
  hideArtiface?: boolean;
  disableHover?: boolean;
}

export default function LootItemIcon(props: Props) {
  const { data: item, isSuccess } = useBungieItemDetails(props.loot.itemHash);

  const img = (
    <div
      style={{
        width: props.size,
        height: props.size,
        position: "relative",
      }}
    >
      {isSuccess && <Image src={`https://bungie.net/${item?.displayProperties.icon}`} />}
      {item?.iconWatermark && (
        <Image
          src={`https://bungie.net/${item.iconWatermark}`}
          style={{ position: "absolute", left: 0, top: 0 }}
        />
      )}
      {!props.hideArtiface && props.loot.artiface && (
        <Image
          src="/icons/attributes/artiface.png"
          h="30%"
          w="30%"
          style={{ position: "absolute", right: 2, top: 2 }}
        />
      )}
      {props.loot.quantity && props.loot.quantity > 1 && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            height: 18,
            display: "flex",
            padding: "2px 6px",
            color: "white",
            lineHeight: "14px",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "14px",
            fontWeight: "600",
            borderTopLeftRadius: 6,
          }}
        >
          {props.loot.quantity}
        </div>
      )}
    </div>
  );

  return props.disableHover ? (
    img
  ) : (
    <HoverCard shadow="md" closeDelay={0}>
      <HoverCard.Target>{img}</HoverCard.Target>
      <HoverCardDropdown p="sm">
        <LootListing loot={props.loot} noIcon />
      </HoverCardDropdown>
    </HoverCard>
  );
}
