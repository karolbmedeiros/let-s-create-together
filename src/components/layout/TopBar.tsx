import { useRouterState } from "@tanstack/react-router";

const titles: Record<string, string> = {
  "/templates": "Templates de Contrato",
  "/generate": "Gerar Contrato",
  "/contracts": "Contratos Gerados",
};

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = titles[pathname] ?? "ContratoGen";

  return (
    <header className="flex h-14 items-center border-b border-gray-200 bg-white px-6">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
    </header>
  );
}
