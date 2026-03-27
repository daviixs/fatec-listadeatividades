"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type MateriaApiResponse } from "@/lib/studentApi"
import { TipoAtividade } from "@/types/admin"

interface FilterSidebarProps {
  materias: MateriaApiResponse[]
  materiaSelecionada: number | null
  onMateriaChange: (materiaId: number | null) => void
  tiposFiltro: Set<TipoAtividade>
  onTipoToggle: (tipo: TipoAtividade) => void
  onAdicionarTarefa: () => void
}

export function FilterSidebar({
  materias,
  materiaSelecionada,
  onMateriaChange,
  tiposFiltro,
  onTipoToggle,
  onAdicionarTarefa,
}: FilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const tipoOptions = [
    { value: TipoAtividade.ATIVIDADE, label: "Atividade" },
    { value: TipoAtividade.PROVA, label: "Prova" },
    { value: TipoAtividade.TRABALHO, label: "Trabalho" },
  ]

  return (
    <aside
      className={cn(
        "w-64 shrink-0 border-r border-slate-200 bg-slate-50 transition-all",
        isCollapsed && "w-16"
      )}
    >
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className={cn(
            "font-bold text-slate-900",
            isCollapsed && "hidden"
          )}>
            FILTROS
          </h2>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "rounded-md p-1.5 text-slate-600 hover:bg-slate-200 transition-colors",
              !isCollapsed && "hidden lg:block"
            )}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          {!isCollapsed && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Matéria
                </label>
                <Select
                  value={materiaSelecionada?.toString() || "all"}
                  onValueChange={(value) =>
                    onMateriaChange(value === "all" ? null : Number(value))
                  }
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as matérias</SelectItem>
                    {materias.map((materia) => (
                      <SelectItem key={materia.id} value={materia.id.toString()}>
                        {materia.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Tipo
                </label>
                <div className="space-y-2">
                  {tipoOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        checked={tiposFiltro.has(option.value)}
                        onCheckedChange={() => onTipoToggle(option.value)}
                      />
                      <label className="text-sm text-slate-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {isCollapsed && (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Matérias"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Tipos"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className={cn("mt-4", isCollapsed && "flex flex-col items-center gap-2")}>
          <Button
            size={isCollapsed ? "icon" : "default"}
            onClick={onAdicionarTarefa}
            className={cn(
              "w-full gap-2",
              isCollapsed && "size-8 rounded-lg"
            )}
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && "Adicionar Tarefa"}
          </Button>
        </div>
      </div>
    </aside>
  )
}
