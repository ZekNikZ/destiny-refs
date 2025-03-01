import { useState } from "react";
import { WOMPunishment } from "../../data/wom/wom-types";
import { Button, Input, NumberInput, Table, Textarea } from "@mantine/core";

interface Props {
  punishment: WOMPunishment;
  onChange: (punishment: WOMPunishment) => void;
  onRemove: () => void;
}

export default function WOMEditorRow(props: Props) {
  const [punishment, setPunishment] = useState(props.punishment);

  const onChangeWeight = (weight: string | number) => {
    if (typeof weight === "string") {
      return;
    }
    setPunishment((state) => {
      const newState = { ...state, weight };
      props.onChange(newState);
      return newState;
    });
  };

  const onChangeName = (text: string) => {
    setPunishment((state) => {
      const newState = { ...state, text };
      props.onChange(newState);
      return newState;
    });
  };

  const onChangeTags = (tags: string) => {
    setPunishment((state) => {
      const newState = { ...state, tags: tags.split(",") };
      props.onChange(newState);
      return newState;
    });
  };

  const onChangeExtraRolls = (extraSpins: string | number) => {
    if (typeof extraSpins === "string") {
      return;
    }
    setPunishment((state) => {
      const newState = { ...state, extraSpins };
      props.onChange(newState);
      return newState;
    });
  };

  return (
    <Table.Tr>
      <Table.Td>
        <NumberInput value={punishment.weight} min={1} onChange={onChangeWeight} />
      </Table.Td>
      <Table.Td>
        <Textarea
          placeholder="Punishment"
          value={punishment.text}
          autosize
          onChange={(event) => onChangeName(event.target.value)}
        />
      </Table.Td>
      <Table.Td>
        <Input
          placeholder="Tags (optional)"
          value={punishment.tags?.join(",")}
          onChange={(event) => onChangeTags(event.target.value)}
        />
      </Table.Td>
      <Table.Td>
        <NumberInput value={punishment.extraSpins} min={0} onChange={onChangeExtraRolls} />
      </Table.Td>
      <Table.Td>
        <Button variant="subtle" color="red" onClick={props.onRemove}>
          Remove
        </Button>
      </Table.Td>
    </Table.Tr>
  );
}
