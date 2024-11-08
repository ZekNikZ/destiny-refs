import { Loot } from "../../data/types";
import LootGroupIcon from "./LootGroupIcon";
import LootItemIcon from "./LootItemIcon";

interface Props {
  loot: Loot;
  size?: number;
  hideArtiface?: boolean;
  disableHover?: boolean;
  hideQuantity?: boolean;
}

export default function LootIcon(props: Props) {
  switch (props.loot.type) {
    case "item":
      return (
        <LootItemIcon
          loot={props.loot}
          size={props.size ?? 60}
          hideArtiface={props.hideArtiface}
          disableHover={props.disableHover}
          hideQuantity={props.hideQuantity}
        />
      );
    case "group":
      return (
        <LootGroupIcon
          loot={props.loot}
          size={props.size ?? 60}
          hideArtiface={props.hideArtiface}
          hideQuantity={props.hideQuantity}
        />
      );
    default:
      throw new Error("Invalid loot type");
  }
}
