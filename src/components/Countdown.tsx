import { Card, Stack, Text, Title } from "@mantine/core";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";

interface Props {
  title: string;
  to: Dayjs;
}

export default function Countdown(props: Props) {
  const [timeString, setTimeString] = useState("");

  const intervalRef = useRef<number>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = dayjs();
      const diff = props.to.diff(now);
      const duration = dayjs.duration(diff);
      setTimeString(duration.format("D[d] H[h] m[m] s[s]"));
    });
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card
      withBorder
      shadow="sm"
      padding="xs"
      radius="sm"
      style={{ flexGrow: 1, flexBasis: "350px" }}
    >
      <Stack gap="xs" align="center">
        <Title order={3} size="h3" ta="center">
          {props.title}
        </Title>
        <Text fw="bold">{timeString}</Text>
      </Stack>
    </Card>
  );
}
