import { Stack } from "@mantine/core";
import { LootPool } from "../data/types";
import LootPoolEntry from "./LootPoolEntry";

interface Props {
  pools: LootPool[];
  title?: string;
  parentActivityIsFeatured?: boolean;
}

const LootTable = (props: Props) => {
  // TODO: title

  return (
    <Stack>
      {props.pools.map((pool) => (
        <LootPoolEntry pool={pool} parentActivityIsFeatured={props.parentActivityIsFeatured} />
      ))}
    </Stack>
  );
};

export default LootTable;
