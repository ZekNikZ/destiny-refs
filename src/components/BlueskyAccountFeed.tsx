import { BlueskyProfilePosts } from "bluesky-embed-react";

interface Props {
  userHandle: string;
  postLimit: number;
}

export default function BlueskyAccountFeed(props: Props) {
  return <BlueskyProfilePosts userHandle={props.userHandle} pageSize={props.postLimit} />;
}
