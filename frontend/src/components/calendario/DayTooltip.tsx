"use client"

import { cn } from "@/lib/utils"
import { formatDateFull } from "@/lib/calendarUtils"
import { type Atividade } from "@/types/admin"
import { TipoAtividade } from "@/types/admin"
import { FileText, GraduationCap, BookOpen } from "lucide-react"

interface DayTooltipProps {
  date: Date
  atividades: Atividade[]
  visible: boolean
  position: { x: number; y: number }
  onClose: () => void
  tiposFiltro: Set<TipoAtividade>
}

const MAX_PREVIEW_ACTIVITIES = 4

export function DayTooltip({
  date,
  atividades,
  visible,
  position,
  onClose,
  tiposFiltro,
}: DayTooltipProps) {
  const filteredActivities = atividades.filter((atividade) => tiposFiltro.has(atividade.tipo))
  const hasMore = filteredActivities.length > MAX_PREVIEW_ACTIVITIES
  const previewActivities = filteredActivities.slice(0, MAX_PREVIEW_ACTIVITIES)

  if (!visible || previewActivities.length === 0) {
    return null
  }

  const getTypeIcon = (tipo: TipoAtividade) => {
    switch (tipo) {
      case TipoAtividade.PROVA:
        return <GraduationCap className="w-3 h-3 shrink-0" />
      case TipoAtividade.ATIVIDADE:
        return <BookOpen className="w-3 h-3 shrink-0" />
      case TipoAtividade.TRABALHO:
        return <FileText className="w-3 h-3 shrink-0" />
    }
  }

  const getTypeColor = (tipo: TipoAtividade) => {
    switch (tipo) {
      case TipoAtividade.PROVA:
        return "text-red-700"
      case TipoAtividade.ATIVIDADE:
        return "text-blue-700"
      case TipoAtividade.TRABALHO:
        return "text-emerald-700"
    }
  }

  const getTypeBgColor = (tipo: TipoAtividade) => {
    switch (tipo) {
      case TipoAtividade.PROVA:
        return "bg-red-50"
      case TipoAtividade.ATIVIDADE:
        return "bg-blue-50"
      case TipoAtividade.TRABALHO:
        return "bg-emerald-50"
    }
  }

  return (
    <div
      className="fixed z-50 w-64 rounded-lg border border-slate-200 bg-white shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-xs font-semibold text-slate-900">
          {formatDateFull(date)}
        </p>
      </div>

      <div className="max-h-80 overflow-y-auto p-2 space-y-1.5">
        {previewActivities.map((atividade) => (
          <div
            key={atividade.id}
            className={cn(
              "flex items-start gap-2 rounded-md px-2 py-1.5",
              getTypeBgColor(atividade.tipo)
            )}
          >
            <div className={cn("mt-0.5", getTypeColor(atividade.tipo))}>
              {getTypeIcon(atividade.tipo)}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate text-xs font-medium text-slate-900">
                {atividade.titulo}
              </p>
              <p className="truncate text-[11px] text-slate-600">
                {atividade.materiaNome} • {atividade.tipo}
              </p>
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="px-2 py-1.5">
            <p className="text-center text-xs font-medium text-slate-600">
              Ver mais {filteredActivities.length - MAX_PREVIEW_ACTIVITIES} atividade(s)...
            </p>
          </div>
        )}

        {previewActivities.length === 0 && (
          <div className="px-2 py-3 text-center">
            <p className="text-xs text-slate-500">
              Nenhuma atividade neste dia
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
