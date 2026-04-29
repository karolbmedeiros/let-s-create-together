import type { TemplateCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<TemplateCategory | "Todos"> = [
  "Todos",
  "Residencial",
  "Comercial",
  "Temporada",
  "Outros",
];

interface Props {
  selected: TemplateCategory | "Todos";
  onChange: (cat: TemplateCategory | "Todos") => void;
}

export function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            selected === cat
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
