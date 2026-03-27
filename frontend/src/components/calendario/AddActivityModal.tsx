"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { type MateriaApiResponse } from "@/lib/studentApi"
import { TipoAtividade, TipoEntrega } from "@/types/admin"
import studentApi from "@/lib/studentApi"

interface AddActivityModalProps {
  materias: MateriaApiResponse[]
  materiaSelecionada: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface ActivityFormState {
  titulo: string
  descricao: string
  tipoEntrega: TipoEntrega
  linkEntrega: string
  tipo: TipoAtividade
  prazo: string
  regras: string
  materiaId: number | null
}

const initialFormState: ActivityFormState = {
  titulo: "",
  descricao: "",
  tipoEntrega: TipoEntrega.ENTREGA_MANUAL,
  linkEntrega: "",
  tipo: TipoAtividade.ATIVIDADE,
  prazo: "",
  regras: "",
  materiaId: null,
}

export function AddActivityModal({
  materias,
  materiaSelecionada,
  open,
  onOpenChange,
  onSuccess,
}: AddActivityModalProps) {
  const [form, setForm] = useState<ActivityFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setForm(initialFormState)
    } else if (materiaSelecionada) {
      // Encontrar o ID da matéria pelo nome
      const materia = materias.find((m) => m.nome === materiaSelecionada)
      if (materia) {
        setForm((prev) => ({ ...prev, materiaId: materia.id }))
      }
    }
  }, [open, materiaSelecionada, materias])

  const handleCreateActivity = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.materiaId) {
      toast.error("Selecione uma matéria.")
      return
    }

    if (!form.titulo.trim() || !form.descricao.trim() || !form.regras.trim() || !form.prazo) {
      toast.error("Preencha os campos obrigatórios.")
      return
    }

    if (form.tipoEntrega === TipoEntrega.LINK_EXTERNO && !form.linkEntrega.trim()) {
      toast.error("Informe o link de entrega para entrega externa.")
      return
    }

    setIsSubmitting(true)
    try {
      await studentApi.criarAtividade({
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        tipoEntrega: form.tipoEntrega,
        linkEntrega: form.tipoEntrega === TipoEntrega.LINK_EXTERNO ? form.linkEntrega.trim() : null,
        regras: form.regras.trim(),
        prazo: form.prazo,
        materiaId: form.materiaId,
        tipo: form.tipo,
      })

      setForm(initialFormState)
      onOpenChange(false)
      onSuccess()
      toast.success("Atividade criada com sucesso.")
    } catch {
      toast.error("Não foi possível criar a atividade.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-4 sm:px-6 pt-6 pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Nova Atividade
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm sm:text-base">
            Preencha os dados para cadastrar uma nova atividade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateActivity} className="px-4 sm:px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-sm">
              Título *
            </Label>
            <Input
              id="titulo"
              value={form.titulo}
              onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))}
              placeholder="Ex: Lista de exercícios 03"
              className="h-11 sm:h-10 text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-sm">
              Descrição *
            </Label>
            <Textarea
              id="descricao"
              value={form.descricao}
              onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))}
              placeholder="Descreva o objetivo da atividade"
              className="min-h-24 text-base resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Tipo *</Label>
              <Select
                value={form.tipo}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, tipo: value as TipoAtividade }))
                }
              >
                <SelectTrigger className="h-11 sm:h-10 w-full text-base">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TipoAtividade.ATIVIDADE}>Atividade</SelectItem>
                  <SelectItem value={TipoAtividade.PROVA}>Prova</SelectItem>
                  <SelectItem value={TipoAtividade.TRABALHO}>Trabalho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prazo" className="text-sm">
                Prazo *
              </Label>
              <Input
                id="prazo"
                type="date"
                value={form.prazo}
                onChange={(event) => setForm((prev) => ({ ...prev, prazo: event.target.value }))}
                className="h-11 sm:h-10 text-base"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Tipo de Entrega *</Label>
              <Select
                value={form.tipoEntrega}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, tipoEntrega: value as TipoEntrega }))
                }
              >
                <SelectTrigger className="h-11 sm:h-10 w-full text-base">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TipoEntrega.ENTREGA_MANUAL}>Entrega Manual</SelectItem>
                  <SelectItem value={TipoEntrega.LINK_EXTERNO}>Link Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="materia" className="text-sm">
                Matéria *
              </Label>
              <Select
                value={form.materiaId?.toString() || ""}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, materiaId: Number(value) }))
                }
              >
                <SelectTrigger className="h-11 sm:h-10 w-full text-base">
                  <SelectValue placeholder="Selecione uma matéria" />
                </SelectTrigger>
                <SelectContent>
                  {materias.map((materia) => (
                    <SelectItem key={materia.id} value={materia.id.toString()}>
                      {materia.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.tipoEntrega === TipoEntrega.LINK_EXTERNO && (
            <div className="space-y-2">
              <Label htmlFor="linkEntrega" className="text-sm">
                Link de Entrega *
              </Label>
              <Input
                id="linkEntrega"
                type="url"
                value={form.linkEntrega}
                onChange={(event) => setForm((prev) => ({ ...prev, linkEntrega: event.target.value }))}
                placeholder="https://..."
                className="h-11 sm:h-10 text-base"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="regras" className="text-sm">
              Regras *
            </Label>
            <Textarea
              id="regras"
              value={form.regras}
              onChange={(event) => setForm((prev) => ({ ...prev, regras: event.target.value }))}
              placeholder="Ex: atividade individual, sem consulta, enviar em PDF"
              className="min-h-20 text-base resize-none"
              required
            />
          </div>

          <DialogFooter className="mt-4 sm:mt-2 -mx-4 sm:-mx-6 -mb-6 px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 sm:h-10 rounded-xl w-full sm:w-auto text-base"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-11 sm:h-10 rounded-xl font-semibold w-full sm:w-auto text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Cadastrar Atividade"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
