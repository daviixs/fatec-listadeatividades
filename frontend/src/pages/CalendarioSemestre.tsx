"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { AlertTriangle, Loader2 } from "lucide-react"
import { PageTransition } from "@/components/layout/PageTransition"
import { getCourseById, getSemesterById } from "@/data/courses"
import { FilterSidebar } from "@/components/calendario/FilterSidebar"
import { CalendarGrid } from "@/components/calendario/CalendarGrid"
import { CalendarLegend } from "@/components/calendario/CalendarLegend"
import { DayDetailModal } from "@/components/calendario/DayDetailModal"
import { AddActivityModal } from "@/components/calendario/AddActivityModal"
import studentApi, { type MateriaApiResponse } from "@/lib/studentApi"
import { resolveSalaFromRoute } from "@/lib/routeResolver"
import { toast } from "sonner"
import { type Atividade } from "@/types/admin"
import { TipoAtividade } from "@/types/admin"

export function CalendarioSemestre() {
  const { courseId, periodId, semesterId } = useParams()

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [sala, setSala] = useState<{ id: number; nome: string; semestre: string } | null>(null)
  const [materias, setMaterias] = useState<MateriaApiResponse[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])

  const [materiaFiltro, setMateriaFiltro] = useState<number | null>(null)
  const [tiposFiltro, setTiposFiltro] = useState<Set<TipoAtividade>>(
    new Set([TipoAtividade.ATIVIDADE, TipoAtividade.PROVA, TipoAtividade.TRABALHO])
  )
  const [mesAtual, setMesAtual] = useState<Date>(new Date())
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const course = getCourseById(courseId || "")
  const semester = getSemesterById(courseId || "", semesterId || "")

  const periodText = periodId === "diurno" ? "Diurno" : "Noturno"
  const formattedSemester = useMemo(
    () => semester?.name || `${semesterId}º semestre`,
    [semester, semesterId]
  )

  useEffect(() => {
    const loadData = async () => {
      if (!courseId || !periodId || !semesterId) {
        setErrorMessage("Informações da rota não encontradas.")
        setLoading(false)
        return
      }

      setLoading(true)
      setErrorMessage(null)

      try {
        const salas = await studentApi.getSalas()
        const resolvedSala = resolveSalaFromRoute(salas, courseId, periodId, semesterId)

        if (!resolvedSala) {
          setErrorMessage("Não foi possível identificar a sala desta rota.")
          return
        }

        setSala({ id: resolvedSala.id, nome: resolvedSala.nome, semestre: resolvedSala.semestre })

        const materiasData = await studentApi.getMateriasPorSala(resolvedSala.id)
        setMaterias(materiasData)

        const atividadesPorMateria = await Promise.all(
          materiasData.map(async (materia) => {
            const atividadesData = await studentApi.getAtividadesPorMateria(materia.id)
            return atividadesData.map((atividade) => ({
              ...atividade,
              materiaNome: materia.nome,
            }))
          })
        )

        const todasAtividades = atividadesPorMateria.flat()
        setAtividades(todasAtividades)
      } catch (err) {
        console.error("Erro ao carregar dados do calendário:", err)
        setErrorMessage("Não foi possível carregar os dados do calendário no momento.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [courseId, periodId, semesterId])

  useEffect(() => {
    const handleMonthChange = (event: CustomEvent) => {
      setMesAtual(event.detail)
    }

    window.addEventListener("calendarMonthChange", handleMonthChange as EventListener)
    return () => {
      window.removeEventListener("calendarMonthChange", handleMonthChange as EventListener)
    }
  }, [])

  const handleTipoToggle = (tipo: TipoAtividade) => {
    setTiposFiltro((prev) => {
      const newFiltro = new Set(prev)
      if (newFiltro.has(tipo)) {
        newFiltro.delete(tipo)
      } else {
        newFiltro.add(tipo)
      }
      return newFiltro
    })
  }

  const handleAdicionarTarefa = () => {
    if (!materiaFiltro) {
      toast.error("Selecione uma matéria primeiro.")
      return
    }
    setIsAddModalOpen(true)
  }

  const handleAtividadeSuccess = async () => {
    if (sala) {
      const atividadesPorMateria = await Promise.all(
        materias.map(async (materia) => {
          const atividadesData = await studentApi.getAtividadesPorMateria(materia.id)
          return atividadesData.map((atividade) => ({
            ...atividade,
            materiaNome: materia.nome,
          }))
        })
      )

      const todasAtividades = atividadesPorMateria.flat()
      setAtividades(todasAtividades)
    }
  }

  const filteredAtividades = useMemo(() => {
    return atividades.filter((atividade) => {
      if (materiaFiltro && atividade.materiaId !== materiaFiltro) {
        return false
      }
      if (!tiposFiltro.has(atividade.tipo)) {
        return false
      }
      if (atividade.status === "CANCELADA") {
        return false
      }
      return true
    })
  }, [atividades, materiaFiltro, tiposFiltro])

  const atividadesDoDia = useMemo(() => {
    if (!diaSelecionado) return []
    const diaData = new Date(diaSelecionado)
    return filteredAtividades.filter((atividade) => {
      const atividadeDate = new Date(atividade.prazo)
      return atividadeDate.toDateString() === diaData.toDateString()
    })
  }, [diaSelecionado, filteredAtividades])

  const handleDiaModalChange = (open: boolean) => {
    setDiaSelecionado(open ? diaSelecionado : null)
  }

  const handleAddModalChange = (open: boolean) => {
    setIsAddModalOpen(open)
  }

  if (!course || !semester) {
    return (
      <PageTransition>
        <div className="p-8 text-center text-slate-500">
          Informações não encontradas.
        </div>
      </PageTransition>
    )
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-slate-600 mb-4" />
          <p className="text-slate-600 font-medium text-sm sm:text-base">
            Carregando calendário...
          </p>
        </div>
      </PageTransition>
    )
  }

  if (errorMessage) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 mt-6 sm:mt-10 rounded-3xl bg-white border-2 border-slate-200/70">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 sm:mb-5">
            <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-2">
            Não foi possível abrir esta página
          </h2>
          <p className="text-slate-600 text-center max-w-lg text-sm sm:text-base">
            {errorMessage}
          </p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mb-6 sm:mb-8 lg:mb-10 text-center md:text-left animate-in-fade">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-3">
              Calendário - {formattedSemester}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {course?.name}
              </span>
              {" • "}
              {periodText}
              {sala?.nome && ` • ${sala.nome}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <FilterSidebar
          materias={materias}
          materiaSelecionada={materiaFiltro}
          onMateriaChange={setMateriaFiltro}
          tiposFiltro={tiposFiltro}
          onTipoToggle={handleTipoToggle}
          onAdicionarTarefa={handleAdicionarTarefa}
        />

        <div className="flex-1">
          <div className="flex items-center justify-end mb-3">
            <button
              type="button"
              onClick={() => setMesAtual(new Date())}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Hoje
            </button>
          </div>

          <CalendarGrid
            mesAtual={mesAtual}
            atividades={filteredAtividades}
            tiposFiltro={tiposFiltro}
            onDiaClick={setDiaSelecionado}
            onDiaHover={() => {}}
          />

          <div className="mt-4">
            <CalendarLegend
              tiposFiltro={tiposFiltro}
              onTipoToggle={handleTipoToggle}
            />
          </div>
        </div>
      </div>

      <DayDetailModal
        date={diaSelecionado || new Date()}
        atividades={atividadesDoDia}
        tiposFiltro={tiposFiltro}
        open={!!diaSelecionado}
        onOpenChange={handleDiaModalChange}
      />

      <AddActivityModal
        materias={materias}
        materiaSelecionada={materiaFiltro}
        open={isAddModalOpen}
        onOpenChange={handleAddModalChange}
        onSuccess={handleAtividadeSuccess}
      />
    </PageTransition>
  )
}
