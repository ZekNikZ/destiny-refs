import { Group, Stack } from "@mantine/core";
import { LootPool } from "../data/types";
import LootTable from "./LootTable";

interface Props {
  pool: LootPool;
  parentActivityIsFeatured?: boolean;
}

const LootPoolEntry = (props: Props) => {
  if (props.pool.type === "mode_specific") {
    return (
      <Stack>
        {props.pool.modes.map((mode) => (
          <LootTable
            pools={mode.children}
            title={mode.mode}
            parentActivityIsFeatured={props.parentActivityIsFeatured}
          />
        ))}
      </Stack>
    );
  } else if (props.pool.type === "pool") {
    // TODO: this
    return <Group></Group>;
  }
};

export default LootPoolEntry;
