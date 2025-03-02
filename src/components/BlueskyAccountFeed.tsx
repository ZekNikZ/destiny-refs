import { BlueskyProfilePosts } from "bluesky-embed-react";

interface Props {
  userHandle: string;
}

export default function BlueskyAccountFeed(props: Props) {
  return <BlueskyProfilePosts userHandle={props.userHandle} pageSize={5} infiniteLoad />;
}
