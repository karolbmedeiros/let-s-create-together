import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/generate", label: "Gerar Contrato", icon: FilePlus },
  { href: "/contracts", label: "Contratos Gerados", icon: FileText },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="fixed left-0 top-0 z-10 flex h-screen w-60 flex-col bg-gray-900">
      {/* Logo */}
      <div className="border-b border-gray-700 px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-white">ContratoGen</p>
            <p className="text-xs text-gray-400">Gerador de Contratos</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 px-6 py-4">
        <p className="text-xs text-gray-500">Imobiliária Exemplo LTDA</p>
      </div>
    </aside>
  );
}
