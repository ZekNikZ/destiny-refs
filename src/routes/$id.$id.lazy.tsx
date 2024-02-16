import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/$id/$id")({
  component: () => <div>Hello /$id!</div>,
});
