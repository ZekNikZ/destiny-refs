import { Activity, ActivityAvailability, ContentBlock } from "../../data/types";
import ImageBlock from "./ImageBlock";
import SpecialZeroHourMaps from "./SpecialZeroHourMaps";
import TextBlock from "./TextBlock";

interface Props {
  activity: Activity;
  activityAvailability?: ActivityAvailability;
  contentBlock: ContentBlock;
}

export default function ContentBlockDisplay(props: Props) {
  switch (props.contentBlock.type) {
    case "special-zero-hour-map":
      return (
        <SpecialZeroHourMaps
          activity={props.activity}
          activityAvailability={props.activityAvailability}
          contentBlock={props.contentBlock}
        />
      );
    case "text":
      return (
        <TextBlock
          activity={props.activity}
          activityAvailability={props.activityAvailability}
          contentBlock={props.contentBlock}
        />
      );
    case "image":
      return (
        <ImageBlock
          activity={props.activity}
          activityAvailability={props.activityAvailability}
          contentBlock={props.contentBlock}
        />
      );
    default:
      throw new Error(`Unsupported content block type: ${props.contentBlock.type}`);
  }
}
