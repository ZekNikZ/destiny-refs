import { Stack, Title } from "@mantine/core";
import { useGlobalData } from "../data/useGlobalData";
import ActivityRotationDisplay from "../components/rotations/ActivityRotationDisplay";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function RotationsPage() {
  const { rotations } = useGlobalData();

  return (
    <Stack>
      <Title>Rotations</Title>
      <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 1500: 2 }}>
        <Masonry columnsCount={2} gutter="10px">
          {rotations.activityRotations.map((rotation) => (
            <ActivityRotationDisplay key={rotation.id} rotation={rotation} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </Stack>
  );
}
