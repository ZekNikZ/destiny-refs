import { Button, Group, Modal, Stack, Table } from "@mantine/core";
import { useWOMData } from "../../data/wom/useWOMData";

export default function PunishmentSelectorModal() {
  const openModal = useWOMData((state) => state.openModal);
  const selectedPunishmentList = useWOMData((state) => state.selectedPunishmentList);
  const customPunishmentLists = useWOMData((state) => state.customPunishmentLists);
  const openEditModal = useWOMData((state) => state.openEditModal);
  const closeModal = useWOMData((state) => state.closeModal);
  const selectPunishmentList = useWOMData((state) => state.selectPunishmentList);
  const duplicatePunishmentList = useWOMData((state) => state.duplicatePunishmentList);
  const removePunishmentList = useWOMData((state) => state.removePunishmentList);

  return (
    <Modal opened={openModal === "list"} onClose={closeModal} size="70%" title="Settings">
      <Stack>
        <Table striped highlightOnHover withTableBorder>
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
                    disabled={selectedPunishmentList === "Default"}
                    onClick={() => selectPunishmentList("Default")}
                  >
                    Select
                  </Button>
                  <Button variant="subtle" disabled>
                    Edit
                  </Button>
                  <Button variant="subtle" onClick={() => duplicatePunishmentList("Default")}>
                    Duplicate
                  </Button>
                  <Button variant="subtle" color="red" disabled>
                    Remove
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
            {customPunishmentLists.map((list) => (
              <Table.Tr>
                <Table.Td>{list.name}</Table.Td>
                <Table.Td>
                  <Group justify="flex-end">
                    <Button
                      variant="subtle"
                      color="green"
                      disabled={selectedPunishmentList === list.name}
                      onClick={() => selectPunishmentList(list.name)}
                    >
                      Select
                    </Button>
                    <Button variant="subtle" onClick={() => openEditModal(list.name)}>
                      Edit
                    </Button>
                    <Button variant="subtle" onClick={() => duplicatePunishmentList(list.name)}>
                      Duplicate
                    </Button>
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={() => removePunishmentList(list.name)}
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
