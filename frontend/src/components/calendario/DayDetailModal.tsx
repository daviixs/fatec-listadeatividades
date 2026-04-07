"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatDateFull, formatDate } from "@/lib/calendarUtils"
import { type Atividade } from "@/types/admin"
import { TipoAtividade, StatusAprovacao } from "@/types/admin"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, GraduationCap, BookOpen, FileText } from "lucide-react"

interface DayDetailModalProps {
  date: Date
  atividades: Atividade[]
  tiposFiltro: Set<TipoAtividade>
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MAX_PREVIEW_ACTIVITIES = 4

export function DayDetailModal({
  date,
  atividades,
  tiposFiltro,
  open,
  onOpenChange,
}: DayDetailModalProps) {
  const [localTiposFiltro, setLocalTiposFiltro] = useState<Set<TipoAtividade>>(tiposFiltro)

  const filteredActivities = atividades.filter((atividade) =>
    localTiposFiltro.has(atividade.tipo)
  )

  const getTypeIcon = (tipo: TipoAtividade) => {
    switch (tipo) {
      case TipoAtividade.PROVA:
        return <GraduationCap className="w-5 h-5" />
      case TipoAtividade.ATIVIDADE:
        return <BookOpen className="w-5 h-5" />
      case TipoAtividade.TRABALHO:
        return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (tipo: TipoAtividade) => {
    switch (tipo) {
      case TipoAtividade.PROVA:
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
        }
      case TipoAtividade.ATIVIDADE:
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
        }
      case TipoAtividade.TRABALHO:
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          border: "border-emerald-200",
        }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APROVADA":
        return "bg-emerald-100 text-emerald-700"
      case "PENDENTE":
        return "bg-amber-100 text-amber-700"
      case "REJEITADA":
        return "bg-rose-100 text-rose-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <DialogHeader className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900">
              {formatDateFull(new Date(date))}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md bg-slate-50 p-3">
            <span className="text-xs font-semibold text-slate-700">Mostrar:</span>
            {Object.values(TipoAtividade).map((tipo) => (
              <div key={tipo} className="flex items-center gap-1.5">
                <Checkbox
                  checked={localTiposFiltro.has(tipo)}
                  onCheckedChange={() => {
                    const newFiltro = new Set(localTiposFiltro)
                    if (newFiltro.has(tipo)) {
                      newFiltro.delete(tipo)
                    } else {
                      newFiltro.add(tipo)
                    }
                    setLocalTiposFiltro(newFiltro)
                  }}
                />
                <label className="text-xs font-medium text-slate-700">
                  {tipo.toLowerCase()}
                </label>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-600">
                Nada marcado para este dia com a seleção atual.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((atividade) => {
                const colors = getTypeColor(atividade.tipo)
                return (
                  <div
                    key={atividade.id}
                    className={cn(
                      "rounded-lg border p-4",
                    colors.border,
                    atividade.status === "CANCELADA" && "opacity-60"
                  )}
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div
                        className={cn(
                          "rounded-lg p-2",
                          colors.bg
                        )}
                      >
                        <div className={cn("", colors.text)}>
                          {getTypeIcon(atividade.tipo)}
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-1">
                        <h3 className="mb-1 truncate font-bold text-slate-900">
                          {atividade.titulo}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {atividade.materiaNome} • {atividade.tipo}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-md bg-slate-50 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Matéria:</span>
                        <span className="text-slate-900">{atividade.materiaNome}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Prazo:</span>
                        <span className="text-slate-900">
                          {formatDate(new Date(atividade.prazo))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Como entregar:</span>
                        <span className="text-slate-900">
                          {atividade.tipoEntrega === "LINK_EXTERNO"
                            ? "Por link"
                            : "Entrega manual"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Status:</span>
                        <Badge className={getStatusColor(atividade.statusAprovacao)}>
                          {atividade.statusAprovacao.toLowerCase()}
                        </Badge>
                      </div>
                      {atividade.tipoEntrega === "LINK_EXTERNO" && atividade.linkEntrega && (
                        <div className="mt-3">
                          <a
                            href={atividade.linkEntrega}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Acessar link de entrega
                          </a>
                        </div>
                      )}
                      {atividade.descricao && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-slate-700 mb-1">
                            Descrição:
                          </p>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {atividade.descricao}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
