import { useBungiePresentationNodeIcon } from "../utils/bungie-api";

interface Props {
  hash: number;
}

export default function BungiePresentationNodeIcon(props: Props) {
  const { data } = useBungiePresentationNodeIcon(props.hash);

  return <img src={`https://www.bungie.net${data}`} alt="" style={{ width: 20, height: 20 }} />;
}
