import { Activity, ActivityAvailability, ContentBlock } from "../../data/types";
import SpecialZeroHourMaps from "./SpecialZeroHourMaps";

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
    default:
      throw new Error(`Unsupported content block type: ${props.contentBlock.type}`);
  }
}

//   <TypographyStylesProvider>
//     <Markdown>{props.activity.guide}</Markdown>
//   </TypographyStylesProvider>;
