"use client"

import { cn } from "@/lib/utils"
import { isSameDay, isToday, isCurrentMonth, formatDate } from "@/lib/calendarUtils"
import { type Atividade } from "@/types/admin"
import { TipoAtividade } from "@/types/admin"

interface CalendarDayProps {
  date: Date
  isCurrentMonth: boolean
  atividades: Atividade[]
  tiposFiltro: Set<TipoAtividade>
  onClick: (date: Date) => void
  onHover: (date: Date | null) => void
  currentDate: Date
}

export function CalendarDay({
  date,
  isCurrentMonth,
  atividades,
  tiposFiltro,
  onClick,
  onHover,
  currentDate,
}: CalendarDayProps) {
  const dayDate = new Date(date)
  const dayIsToday = isToday(dayDate)
  const dayIsCurrentMonth = isCurrentMonth

  // Filtrar atividades por tipo
  const filteredActivities = atividades.filter((atividade) => tiposFiltro.has(atividade.tipo))

  // Agrupar atividades por tipo para os indicadores
  const activitiesByType = {
    [TipoAtividade.PROVA]: filteredActivities.filter((a) => a.tipo === TipoAtividade.PROVA),
    [TipoAtividade.ATIVIDADE]: filteredActivities.filter((a) => a.tipo === TipoAtividade.ATIVIDADE),
    [TipoAtividade.TRABALHO]: filteredActivities.filter((a) => a.tipo === TipoAtividade.TRABALHO),
  }

  const hasActivities = filteredActivities.length > 0

  return (
    <button
      type="button"
      data-slot="calendar-day"
      onClick={() => onClick(date)}
      onMouseEnter={() => onHover(date)}
      onMouseLeave={() => onHover(null)}
      disabled={!isCurrentMonth}
      className={cn(
        "relative flex h-14 w-full flex-col items-start justify-start rounded-lg border transition-all outline-none hover:border-ring hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40",
        dayIsCurrentMonth && "bg-background",
        !dayIsCurrentMonth && "bg-muted/30",
        dayIsToday && "border-ring ring-3 ring-ring/20",
        hasActivities && dayIsToday && "ring-3 ring-ring/40"
      )}
    >
      <span
        className={cn(
          "text-xs font-medium",
          dayIsToday && "font-bold text-primary",
          !dayIsCurrentMonth && "text-muted-foreground"
        )}
      >
        {dayDate.getDate().toString().padStart(2, "0")}
      </span>

      <div className="flex gap-0.5 mt-0.5">
        {activitiesByType[TipoAtividade.PROVA].length > 0 && (
          <span
            className="size-2 rounded-full bg-red-500 shrink-0"
            title={`${activitiesByType[TipoAtividade.PROVA].length} prova(s)`}
          />
        )}
        {activitiesByType[TipoAtividade.ATIVIDADE].length > 0 && (
          <span
            className="size-2 rounded-full bg-blue-500 shrink-0"
            title={`${activitiesByType[TipoAtividade.ATIVIDADE].length} atividade(s)`}
          />
        )}
        {activitiesByType[TipoAtividade.TRABALHO].length > 0 && (
          <span
            className="size-2 rounded-full bg-emerald-500 shrink-0"
            title={`${activitiesByType[TipoAtividade.TRABALHO].length} trabalho(s)`}
          />
        )}
      </div>
    </button>
  )
}
