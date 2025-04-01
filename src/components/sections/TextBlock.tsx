import { TypographyStylesProvider } from "@mantine/core";
import { Activity, ActivityAvailability, ContentBlock } from "../../data/types";
import Markdown from "react-markdown";

interface Props {
  activity: Activity;
  activityAvailability?: ActivityAvailability;
  contentBlock: Extract<ContentBlock, { type: "text" }>;
}

export default function TextBlock(props: Props) {
  return (
    <TypographyStylesProvider>
      <Markdown>{props.contentBlock.text}</Markdown>
    </TypographyStylesProvider>
  );
}
