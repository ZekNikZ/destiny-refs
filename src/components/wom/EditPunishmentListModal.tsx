import { Button, Group, Input, Modal, NumberInput, Stack, Table, Textarea } from "@mantine/core";
import { useWOMData } from "../../data/wom/useWOMData";

export default function EditPunishmentListModal() {
  const openModal = useWOMData((state) => state.openModal);
  const draftPunishmentList = useWOMData((state) => state.draftPunishmentList);
  const saveOpenPunishmentList = useWOMData((state) => state.saveOpenPunishmentList);
  const editDraftName = useWOMData((state) => state.editDraftName);
  const editDraftEntryWeight = useWOMData((state) => state.editDraftEntryWeight);
  const editDraftEntryName = useWOMData((state) => state.editDraftEntryName);
  const editDraftEntryTags = useWOMData((state) => state.editDraftEntryTags);
  const addDraftEntry = useWOMData((state) => state.addDraftEntry);
  const removeDraftEntry = useWOMData((state) => state.removeDraftEntry);

  return (
    <Modal opened={openModal === "edit"} onClose={saveOpenPunishmentList} size="70%" title="Editor">
      <Stack>
        <Group>
          <Input
            placeholder="Punishment List Name"
            value={draftPunishmentList.name}
            onChange={(event) => editDraftName(event.currentTarget.value)}
            w={400}
          />
          <Button onClick={saveOpenPunishmentList}>Save</Button>
        </Group>
        <Table striped highlightOnHover withTableBorder>
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
            {draftPunishmentList.punishments.map((punishment, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <NumberInput
                    value={punishment.weight ?? 1}
                    min={1}
                    onChange={(value) =>
                      typeof value === "number" ? editDraftEntryWeight(index, value) : null
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <Textarea
                    placeholder="Punishment"
                    value={punishment.text}
                    autosize
                    onChange={(event) => editDraftEntryName(index, event.currentTarget.value)}
                  />
                </Table.Td>
                <Table.Td>
                  <Input
                    placeholder="Tags (optional)"
                    value={punishment.tags?.join(", ") ?? ""}
                    onChange={(event) => editDraftEntryTags(index, event.currentTarget.value)}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    value={punishment.extraSpins ?? 0}
                    min={0}
                    onChange={(value) =>
                      typeof value === "number" ? editDraftEntryWeight(index, value) : null
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <Button variant="subtle" color="red" onClick={() => removeDraftEntry(index)}>
                    Remove
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group>
          <Button onClick={addDraftEntry} color="green">
            Add Punishment
          </Button>
          <Button onClick={saveOpenPunishmentList}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
