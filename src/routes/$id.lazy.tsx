import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/$id")({
  component: () => <div>Hello /$id!</div>,
});
