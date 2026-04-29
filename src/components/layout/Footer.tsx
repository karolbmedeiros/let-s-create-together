export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Contratual. Todos os direitos reservados.</p>
        <p>Gere contratos profissionais em minutos.</p>
      </div>
    </footer>
  );
}
