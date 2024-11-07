import { Loot } from "../../data/types";
import LootGroupIcon from "./LootGroupIcon";
import LootItemIcon from "./LootItemIcon";

interface Props {
  loot: Loot;
  size?: number;
  hideArtiface?: boolean;
}

export default function LootIcon(props: Props) {
  if (props.loot.type === "item") {
    return (
      <LootItemIcon loot={props.loot} size={props.size ?? 60} hideArtiface={props.hideArtiface} />
    );
  } else {
    return (
      <LootGroupIcon loot={props.loot} size={props.size ?? 60} hideArtiface={props.hideArtiface} />
    );
  }
}
