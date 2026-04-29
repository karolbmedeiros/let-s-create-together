import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Home → redirect para /templates (mesma estratégia do Next original).
 */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/templates" });
  },
});
