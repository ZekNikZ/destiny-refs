import { Box, ActionIcon, Image, Transition, Modal } from "@mantine/core";
import { ArrowsOutSimple, Copy, DownloadSimple } from "@phosphor-icons/react";
import { Activity, ActivityAvailability, ContentBlock } from "../../data/types";
import { useHover } from "@mantine/hooks";
import { useState } from "react";
import { copyImageToClipboard } from "../../utils/image-copy";

interface Props {
  activity: Activity;
  activityAvailability?: ActivityAvailability;
  contentBlock: Extract<ContentBlock, { type: "image" }>;
}

export default function ImageBlock(props: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const { ref, hovered } = useHover();

  return (
    <Box maw="800px" pos="relative" ref={ref}>
      <Image
        src={props.contentBlock.url}
        alt={props.contentBlock.alt}
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        }}
      />
      <Transition mounted={hovered} transition="fade" duration={100}>
        {(styles) => (
          <ActionIcon.Group pos="absolute" top={10} right={10} style={styles}>
            <ActionIcon variant="default" color="gray" onClick={() => setModalOpen(true)}>
              <ArrowsOutSimple size={20} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              color="gray"
              onClick={() => copyImageToClipboard(props.contentBlock.url)}
            >
              <Copy size={20} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              color="gray"
              component="a"
              href={props.contentBlock.url}
              download
              target="_blank"
            >
              <DownloadSimple size={20} />
            </ActionIcon>
          </ActionIcon.Group>
        )}
      </Transition>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onClick={() => setModalOpen(false)}
        withCloseButton={false}
        centered
        size="100vw"
        padding={0}
        radius={0}
        styles={{
          content: {
            background: "transparent",
          },
        }}
      >
        <Image
          src={props.contentBlock.url}
          alt={props.contentBlock.alt}
          fit="contain"
          h="90vh"
          w="100%"
          style={{
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          }}
        />
      </Modal>
    </Box>
  );
}
