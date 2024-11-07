import { Loot } from "../../data/types";
import LootGroupIcon from "./LootGroupIcon";
import LootItemIcon from "./LootItemIcon";

interface Props {
  loot: Loot;
  size?: number;
}

export default function LootIcon(props: Props) {
  if (props.loot.type === "item") {
    return (
      <LootItemIcon
        itemHash={props.loot.itemHash}
        quantity={props.loot.quantity}
        size={props.size ?? 60}
      />
    );
  } else {
    return <LootGroupIcon loot={props.loot} size={props.size ?? 60} />;
  }
}
