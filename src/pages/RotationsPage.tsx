import { Stack } from "@mantine/core";
import { useGlobalData } from "../data/useGlobalData";
import ActivityRotationDisplay from "../components/rotations/ActivityRotationDisplay";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import RaidChallengeRotationDisplay from "../components/rotations/RaidChallengeRotationDisplay";
import { ActivityRotation } from "../data/types";

const FILTERED_ROTATION_TYPES: ActivityRotation["type"][] = ["daily", "weekly", "newest"];

export default function RotationsPage() {
  const { rotations } = useGlobalData();

  return (
    <Stack>
      <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 1500: 2 }}>
        <Masonry columnsCount={2} gutter="16px">
          {rotations.activityRotations
            .filter((rotation) => FILTERED_ROTATION_TYPES.includes(rotation.type))
            .map((rotation) => (
              <ActivityRotationDisplay key={rotation.id} rotation={rotation} />
            ))}
          <RaidChallengeRotationDisplay />
        </Masonry>
      </ResponsiveMasonry>
    </Stack>
  );
}
