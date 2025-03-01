import { Button, Group, Input, Modal, Stack, Table } from "@mantine/core";
import { useWOMData } from "../../data/wom/useWOMData";
import WOMEditorRow from "./WOMEditorRow";
import { useCallback, useEffect, useState } from "react";
import { WOMPunishment } from "../../data/wom/wom-types";
import { v4 as uuidv4 } from "uuid";

export default function EditPunishmentListModal() {
  const openModal = useWOMData((state) => state.openModal);
  const openEditor = useWOMData((state) => state.openEditor);
  const editPunishmentList = useWOMData((state) => state.editPunishmentList);

  const [listName, setListName] = useState("");
  const [punishmentDrafts, setPunishmentDrafts] = useState<Record<string, WOMPunishment>>({});

  useEffect(() => {
    const draftPunishmentList = useWOMData
      .getState()
      .customPunishmentLists.find((l) => l.id === openEditor);
    if (!draftPunishmentList) {
      return;
    }

    setListName(draftPunishmentList.name);
    setPunishmentDrafts(
      Object.fromEntries(
        draftPunishmentList.punishments.map((punishment) => [punishment.id, punishment])
      )
    );
  }, [openEditor]);

  const onClose = useCallback(() => {
    editPunishmentList({
      id: openEditor,
      name: listName,
      punishments: Object.values(punishmentDrafts),
    });
  }, [listName, punishmentDrafts]);

  const addDraftEntry = () => {
    const id = uuidv4();
    setPunishmentDrafts((drafts) => ({
      ...drafts,
      [id]: { id, weight: 1, text: "", tags: [], extraSpins: 0 },
    }));
  };

  const onChange = (id: string, punishment: WOMPunishment) => {
    setPunishmentDrafts((drafts) => {
      drafts[id] = punishment;
      return drafts;
    });
  };

  const onRemove = (id: string) => {
    setPunishmentDrafts((drafts) => {
      const { [id]: removed, ...rest } = drafts;
      return rest;
    });
  };

  return (
    <Modal opened={openModal === "edit"} onClose={onClose} size="70%" title="Editor">
      <Stack>
        <Group>
          <Input
            placeholder="Punishment List Name"
            value={listName}
            onChange={(event) => setListName(event.currentTarget.value)}
            w={400}
          />
          <Button onClick={onClose}>Save</Button>
        </Group>
        <Table striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={80}>Weight</Table.Th>
              <Table.Th>Punishment</Table.Th>
              <Table.Th>Tags</Table.Th>
              <Table.Th w={100}>Extra Rolls</Table.Th>
              <Table.Th w={100}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Object.entries(punishmentDrafts).map(([id, punishment]) => (
              <WOMEditorRow
                key={id}
                punishment={punishment}
                onChange={(punishment) => onChange(id, punishment)}
                onRemove={() => onRemove(id)}
              />
            ))}
          </Table.Tbody>
        </Table>
        <Group>
          <Button onClick={addDraftEntry} color="green">
            Add Punishment
          </Button>
          <Button onClick={onClose}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
