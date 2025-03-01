import { Button, FileButton, Group, Modal, Stack, Table } from "@mantine/core";
import { useWOMData } from "../../data/wom/useWOMData";
import { WOMPunishmentListSchema } from "../../data/wom/wom-types";

export default function PunishmentSelectorModal() {
  const openModal = useWOMData((state) => state.openModal);
  const selectedPunishmentList = useWOMData((state) => state.selectedPunishmentList);
  const customPunishmentLists = useWOMData((state) => state.customPunishmentLists);
  const openEditModal = useWOMData((state) => state.openEditModal);
  const closeModal = useWOMData((state) => state.closeModal);
  const selectPunishmentList = useWOMData((state) => state.selectPunishmentList);
  const duplicatePunishmentList = useWOMData((state) => state.duplicatePunishmentList);
  const removePunishmentList = useWOMData((state) => state.removePunishmentList);
  const importPunishmentList = useWOMData((state) => state.importPunishmentList);
  const exportPunishmentList = useWOMData((state) => state.exportPunishmentList);
  const createEmptyPunishmentList = useWOMData((state) => state.createEmptyPunishmentList);

  const onUploadFile = (file: File | null) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (event) => {
      const json = event.target?.result;
      if (!json) {
        return;
      }
      const str = JSON.parse(json as string);

      const { success, data, error } = WOMPunishmentListSchema.safeParse(str);
      if (!success) {
        console.error(error);
        return;
      }

      importPunishmentList(data);
    };
    reader.onerror = (event) => {
      console.error(event);
    };
  };

  return (
    <Modal opened={openModal === "list"} onClose={closeModal} size="70%" title="Settings">
      <Stack>
        <Group>
          <Button color="green" onClick={createEmptyPunishmentList}>
            Create Empty
          </Button>
          <FileButton onChange={onUploadFile} accept="application/json">
            {(props) => <Button {...props}>Import</Button>}
          </FileButton>
        </Group>
        <Table striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Punishment List</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Default</Table.Td>
              <Table.Td>
                <Group justify="flex-end">
                  <Button
                    variant="subtle"
                    color="green"
                    disabled={selectedPunishmentList === "default"}
                    onClick={() => selectPunishmentList("default")}
                  >
                    Select
                  </Button>
                  <Button variant="subtle" disabled>
                    Edit
                  </Button>
                  <Button variant="subtle" onClick={() => duplicatePunishmentList("default")}>
                    Duplicate
                  </Button>
                  <Button variant="subtle" onClick={() => exportPunishmentList("default")}>
                    Export
                  </Button>
                  <Button variant="subtle" color="red" disabled>
                    Remove
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
            {customPunishmentLists.map((list) => (
              <Table.Tr key={list.id}>
                <Table.Td>{list.name}</Table.Td>
                <Table.Td>
                  <Group justify="flex-end">
                    <Button
                      variant="subtle"
                      color="green"
                      disabled={selectedPunishmentList === list.id}
                      onClick={() => selectPunishmentList(list.id)}
                    >
                      Select
                    </Button>
                    <Button variant="subtle" onClick={() => openEditModal(list.id)}>
                      Edit
                    </Button>
                    <Button variant="subtle" onClick={() => duplicatePunishmentList(list.id)}>
                      Duplicate
                    </Button>
                    <Button variant="subtle" onClick={() => exportPunishmentList(list.id)}>
                      Export
                    </Button>
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={() => removePunishmentList(list.id)}
                    >
                      Remove
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Modal>
  );
}
