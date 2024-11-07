import { Image } from "@mantine/core";
import { Loot } from "../../data/types";
import LootItemIcon from "./LootItemIcon";

interface Props {
  loot: Extract<Loot, { type: "group" }>;
  size: number;
}

export default function LootGroupIcon(props: Props) {
  return (
    <>
      {props.loot.displayItemHash && (
        <LootItemIcon
          itemHash={props.loot.displayItemHash}
          quantity={props.loot.quantity}
          size={props.size}
        />
      )}
      {!props.loot.displayItemHash && (
        <div
          style={{
            width: props.size,
            height: props.size,
            position: "relative",
          }}
        >
          <Image src={`/icons/loot/${props.loot.displayStaticIcon ?? "legendary-engram"}.png`} />
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
      )}
    </>
  );
}
