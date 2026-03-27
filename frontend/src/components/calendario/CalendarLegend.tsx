"use client"

import { cn } from "@/lib/utils"
import { TipoAtividade } from "@/types/admin"

interface CalendarLegendProps {
  tiposFiltro: Set<TipoAtividade>
  onTipoToggle: (tipo: TipoAtividade) => void
}

export function CalendarLegend({ tiposFiltro, onTipoToggle }: CalendarLegendProps) {
  const legendItems = [
    {
      tipo: TipoAtividade.PROVA,
      label: "Prova",
      colorClass: "bg-red-500",
      textColorClass: "text-red-700",
    },
    {
      tipo: TipoAtividade.ATIVIDADE,
      label: "Atividade",
      colorClass: "bg-blue-500",
      textColorClass: "text-blue-700",
    },
    {
      tipo: TipoAtividade.TRABALHO,
      label: "Trabalho",
      colorClass: "bg-emerald-500",
      textColorClass: "text-emerald-700",
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-xs font-semibold text-slate-700">LEGENDA:</span>
      {legendItems.map((item) => (
        <button
          key={item.tipo}
          type="button"
          onClick={() => onTipoToggle(item.tipo)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted",
            !tiposFiltro.has(item.tipo) && "opacity-40"
          )}
          title={tiposFiltro.has(item.tipo) ? `Ocultar ${item.label}` : `Mostrar ${item.label}`}
        >
          <span
            className={cn("size-2 rounded-full", item.colorClass)}
            aria-hidden="true"
          />
          <span className={cn("", item.textColorClass)}>{item.label}</span>
        </button>
      ))}
    </div>
  )
}
