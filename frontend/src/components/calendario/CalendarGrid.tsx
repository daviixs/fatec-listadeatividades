"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { getWeeksOfMonth, formatMonthYear } from "@/lib/calendarUtils"
import { type Atividade } from "@/types/admin"
import { TipoAtividade } from "@/types/admin"
import { CalendarDay } from "./CalendarDay"
import { DayTooltip } from "./DayTooltip"

export function CalendarGrid({
  mesAtual,
  atividades,
  tiposFiltro,
  onDiaClick,
  onDiaHover,
}: CalendarGridProps) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    date: null,
    position: { x: 0, y: 0 },
  })

  const year = mesAtual.getFullYear()
  const month = mesAtual.getMonth()
        const weeks = getWeeksOfMonth(year, month)

  const handleDayHover = (date: Date | null, event?: React.MouseEvent) => {
    if (date && event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      setTooltip({
        visible: true,
        date,
        position: {
          x: rect.right + 8,
          y: rect.top,
        },
      })
    } else {
      setTooltip({ visible: false, date: null, position: { x: 0, y: 0 } })
    }
  }

  const handleDayClick = (date: Date) => {
    setTooltip({ visible: false, date: null, position: { x: 0, y: 0 } })
    onDiaClick(date)
  }

  const getActivitiesForDay = (date: Date | null): Atividade[] => {
    if (!date) return []
    const dayDate = new Date(date)
    return atividades.filter((atividade) => {
      const atividadeDate = new Date(atividade.prazo)
      return atividadeDate.toDateString() === dayDate.toDateString()
    })
  }
  }

  const handleDayClick = (date: Date) => {
    setTooltip({ visible: false, date: null, position: { x: 0, y: 0 } })
    onDiaClick(date)
  }

  const getActivitiesForDay = (date: Date | null): Atividade[] => {
    if (!date) return []
    const dayDate = new Date(date)
    return atividades.filter((atividade) => {
      const atividadeDate = new Date(atividade.prazo)
      return atividadeDate.toDateString() === dayDate.toDateString()
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => {
            const prevMonth = new Date(mesAtual)
            prevMonth.setMonth(prevMonth.getMonth() - 1)
            onDiaHover(null)
            window.dispatchEvent(new CustomEvent("calendarMonthChange", { detail: prevMonth }))
          }}
          className="rounded-md p-1.5 text-slate-600 hover:bg-muted hover:text-slate-900 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-slate-900">
          {formatMonthYear(mesAtual)}
        </h2>

        <button
          type="button"
          onClick={() => {
            const nextMonth = new Date(mesAtual)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            onDiaHover(null)
            window.dispatchEvent(new CustomEvent("calendarMonthChange", { detail: nextMonth }))
          }}
          className="rounded-md p-1.5 text-slate-600 hover:bg-muted hover:text-slate-900 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {WEEKDAY_NAMES.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-slate-700"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "border-b border-r border-slate-100",
                  dayIndex % 7 === 6 && "border-r-0",
                  weekIndex === weeks.length - 1 && "border-b-0"
                )}
              >
                <CalendarDay
                  date={day}
                  isCurrentMonth={isSameMonth(day)}
                  atividades={getActivitiesForDay(day)}
                  tiposFiltro={tiposFiltro}
                  onClick={handleDayClick}
                  onHover={handleDayHover}
                  currentDate={mesAtual}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {WEEKDAY_NAMES.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-slate-700"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "border-b border-r border-slate-100 last:border-r-0",
                  dayIndex % 7 === 6 && "border-r-0",
                  weekIndex === weeks.length - 1 && "border-b-0"
                )}
              >
                <CalendarDay
                  date={day}
                  isCurrentMonth={day !== null && day.getMonth() === month}
                  atividades={getActivitiesForDay(day)}
                  tiposFiltro={tiposFiltro}
                  onClick={handleDayClick}
                  onHover={handleDayHover}
                  currentDate={mesAtual}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {tooltip.visible && tooltip.date && (
        <DayTooltip
          date={tooltip.date}
          atividades={getActivitiesForDay(tooltip.date)}
          visible={tooltip.visible}
          position={tooltip.position}
          onClose={() => onDiaHover(null)}
          tiposFiltro={tiposFiltro}
        />
      )}
    </div>
   )
}

export { CalendarGrid }

