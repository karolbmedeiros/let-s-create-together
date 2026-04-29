import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground shadow-sm"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <FileText className="h-5 w-5" />
          </span>
          <span>Contratual</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            activeProps={{ className: "text-foreground font-medium" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            activeOptions={{ exact: true }}
            className="rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground"
          >
            Início
          </Link>
          <Link
            to="/contratos/novo"
            activeProps={{ className: "text-foreground font-medium" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground"
          >
            Novo contrato
          </Link>
        </nav>
      </div>
    </header>
  );
}
