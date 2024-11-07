import { Image } from "@mantine/core";
import { useBungieItemDetails } from "../../utils/bungie-api";

interface Props {
  itemHash: number;
  quantity?: number;
}

const LootItemIcon = (props: Props) => {
  const { data: item, isSuccess } = useBungieItemDetails(props.itemHash);

  return (
    <div
      style={{
        width: 60,
        height: 60,
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
  );
};

export default LootItemIcon;
