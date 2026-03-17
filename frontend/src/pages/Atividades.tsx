import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlusCircle, Calendar, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { getSubjectById, getSemesterById, getCourseById } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import studentApi, { type MateriaApiResponse, type SalaApiResponse } from '@/lib/studentApi';
import { TipoAtividade, TipoEntrega, type Atividade } from '@/types/admin';

type ActivityFormState = {
  titulo: string;
  descricao: string;
  tipoEntrega: TipoEntrega;
  linkEntrega: string;
  regras: string;
  prazo: string;
};

const initialFormState: ActivityFormState = {
  titulo: '',
  descricao: '',
  tipoEntrega: TipoEntrega.ENTREGA_MANUAL,
  linkEntrega: '',
  regras: '',
  prazo: '',
};

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveSalaFromRoute(
  salas: SalaApiResponse[],
  courseId: string,
  periodId: string,
  semesterId: string
): SalaApiResponse | null {
  const targetCourse = normalizeText(courseId);
  const periodKeywords =
    periodId === 'diurno'
      ? ['manha', 'diurno', 'matutino']
      : ['noite', 'noturno', 'vespertino'];
  const semesterRegex = new RegExp(`\\b${escapeRegex(semesterId)}\\b`);

  const matched = salas
    .filter((sala) => {
      const salaName = normalizeText(sala.nome);
      const startsWithCourse = salaName.startsWith(targetCourse);
      const hasPeriod = periodKeywords.some((keyword) => salaName.includes(keyword));
      const hasSemester = semesterRegex.test(salaName);
      return startsWithCourse && hasPeriod && hasSemester;
    })
    .sort((a, b) => b.id - a.id);

  return matched[0] || null;
}

function resolveMateriaFromSala(
  materias: MateriaApiResponse[],
  subjectName: string
): MateriaApiResponse | null {
  const normalizedTarget = normalizeText(subjectName);
  return materias.find((materia) => normalizeText(materia.nome) === normalizedTarget) || null;
}

export function Atividades() {
  const { courseId, periodId, semesterId, subjectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [sala, setSala] = useState<SalaApiResponse | null>(null);
  const [materia, setMateria] = useState<MateriaApiResponse | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ActivityFormState>(initialFormState);

  const course = getCourseById(courseId || '');
  const semester = getSemesterById(courseId || '', semesterId || '');
  const subject = getSubjectById(courseId || '', semesterId || '', subjectId || '');

  const formattedSemester = useMemo(() => semester?.name || '', [semester]);
  const formattedPeriod = periodId === 'diurno' ? 'Diurno' : 'Noturno';

  useEffect(() => {
    const loadData = async () => {
      if (!courseId || !periodId || !semesterId || !subject || !course || !formattedSemester) {
        setErrorMessage('Informações da rota não encontradas.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        const salas = await studentApi.getSalas();
        const resolvedSala = resolveSalaFromRoute(salas, courseId, periodId, semesterId);
        if (!resolvedSala) {
          setErrorMessage('Não foi possível identificar a sala desta rota.');
          setLoading(false);
          return;
        }

        const materias = await studentApi.getMateriasPorSala(resolvedSala.id);
        const resolvedMateria = resolveMateriaFromSala(materias, subject.name);
        if (!resolvedMateria) {
          setErrorMessage('Não foi possível relacionar a matéria desta rota com a sala ativa.');
          setLoading(false);
          return;
        }

        setSala(resolvedSala);
        setMateria(resolvedMateria);

        const atividadesData = await studentApi.getAtividadesPorMateria(resolvedMateria.id);
        setAtividades(atividadesData);
      } catch (error) {
        setErrorMessage('Não foi possível carregar os dados desta matéria no momento.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [course, courseId, formattedSemester, periodId, semesterId, subject]);

  const loadAtividades = async (materiaId: number) => {
    const data = await studentApi.getAtividadesPorMateria(materiaId);
    setAtividades(data);
  };

  const openCreateDialog = () => {
    if (!materia) {
      toast.error('Matéria não resolvida para criação de atividade.');
      return;
    }
    setForm(initialFormState);
    setIsCreateDialogOpen(true);
  };

  const handleCreateActivity = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!materia) {
      toast.error('Matéria não encontrada para criar a atividade.');
      return;
    }

    if (!form.titulo.trim() || !form.descricao.trim() || !form.regras.trim() || !form.prazo) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }

    if (form.tipoEntrega === TipoEntrega.LINK_EXTERNO && !form.linkEntrega.trim()) {
      toast.error('Informe o link de entrega para entrega externa.');
      return;
    }

    setIsSubmitting(true);
    try {
      await studentApi.criarAtividade({
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        tipoEntrega: form.tipoEntrega,
        linkEntrega: form.tipoEntrega === TipoEntrega.LINK_EXTERNO ? form.linkEntrega.trim() : null,
        regras: form.regras.trim(),
        prazo: form.prazo,
        materiaId: materia.id,
        tipo: TipoAtividade.ATIVIDADE,
      });

      await loadAtividades(materia.id);
      setIsCreateDialogOpen(false);
      toast.success('Atividade criada com sucesso.');
    } catch (error) {
      toast.error('Não foi possível criar a atividade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course || !semester || !subject) {
    return <div className="p-8 text-center text-slate-500">Informações não encontradas.</div>;
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
          <p className="text-slate-600 font-medium">Carregando atividades...</p>
        </div>
      </PageTransition>
    );
  }

  if (errorMessage) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center p-12 mt-10 rounded-3xl bg-white/70 border border-amber-200">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-2">Não foi possível abrir esta página</h2>
          <p className="text-slate-600 text-center max-w-lg">{errorMessage}</p>
        </div>
      </PageTransition>
    );
  }

  const hasActivities = atividades.length > 0;

  return (
    <PageTransition>
      <div className="mb-10 animate-in-fade">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Atividades
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
          {subject.name} • {sala?.nome || `${course.name} • ${formattedPeriod} • ${formattedSemester}`}
        </p>
      </div>

      {!hasActivities ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200/70 bg-white p-12 mt-10 shadow-sm animate-in-fade">
          <div className="absolute -top-10 -right-8 w-36 h-36 bg-indigo-100/60 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-rose-100/50 rounded-full blur-2xl" />

          <div className="relative flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 text-slate-500 shadow-inner">
              <Calendar className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-indigo-950 mb-2">
              Nenhuma atividade cadastrada
            </h2>
            <p className="text-slate-600 font-medium max-w-md mb-8">
              Esta matéria ainda não possui tarefas. Cadastre a primeira atividade para manter a turma organizada.
            </p>
            <Button
              size="lg"
              className="rounded-xl shadow-sm hover:shadow-md transition-all font-bold px-8 h-12 gap-2 cursor-pointer"
              onClick={openCreateDialog}
            >
              <PlusCircle className="w-5 h-5" />
              Cadastrar Atividade
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Acompanhe as atividades da matéria em tempo real.
            </h2>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="default"
                className="rounded-xl gap-1.5 h-10 font-bold shadow-sm"
                onClick={openCreateDialog}
              >
                <PlusCircle className="w-4 h-4" />
                Nova Atividade
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Título</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Prazo</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Tipo de entrega</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Matéria</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm rounded-tr-2xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {atividades.map((activity) => (
                  <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-indigo-900 flex items-center gap-3">
                      {activity.statusAprovacao === 'APROVADA' ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0"></span>
                      )}
                      {activity.titulo}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{new Date(activity.prazo).toLocaleDateString('pt-BR')}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {activity.tipoEntrega === 'LINK_EXTERNO' ? 'Link Externo' : 'Entrega Manual'}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{activity.materiaNome || subject.name}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        activity.statusAprovacao === 'APROVADA' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : activity.statusAprovacao === 'PENDENTE'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {activity.statusAprovacao === 'APROVADA'
                          ? 'Aprovada'
                          : activity.statusAprovacao === 'PENDENTE'
                          ? 'Pendente'
                          : 'Rejeitada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-extrabold text-slate-900">
              Nova Atividade
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Preencha os dados para cadastrar uma nova atividade em {materia?.nome || subject.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateActivity} className="px-6 pb-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))}
                placeholder="Ex: Lista de exercícios 03"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={form.descricao}
                onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))}
                placeholder="Descreva o objetivo da atividade"
                className="min-h-24"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Entrega *</Label>
                <Select
                  value={form.tipoEntrega}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, tipoEntrega: value as TipoEntrega }))
                  }
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TipoEntrega.ENTREGA_MANUAL}>Entrega Manual</SelectItem>
                    <SelectItem value={TipoEntrega.LINK_EXTERNO}>Link Externo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazo">Prazo *</Label>
                <Input
                  id="prazo"
                  type="date"
                  value={form.prazo}
                  onChange={(event) => setForm((prev) => ({ ...prev, prazo: event.target.value }))}
                  className="h-10"
                  required
                />
              </div>
            </div>

            {form.tipoEntrega === TipoEntrega.LINK_EXTERNO && (
              <div className="space-y-2">
                <Label htmlFor="linkEntrega">Link de Entrega *</Label>
                <Input
                  id="linkEntrega"
                  type="url"
                  value={form.linkEntrega}
                  onChange={(event) => setForm((prev) => ({ ...prev, linkEntrega: event.target.value }))}
                  placeholder="https://..."
                  className="h-10"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="regras">Regras *</Label>
              <Textarea
                id="regras"
                value={form.regras}
                onChange={(event) => setForm((prev) => ({ ...prev, regras: event.target.value }))}
                placeholder="Ex: atividade individual, sem consulta, enviar em PDF"
                className="min-h-20"
                required
              />
            </div>

            <DialogFooter className="mt-2 -mx-6 -mb-6 px-6 py-4 bg-slate-50 border-t border-slate-200 flex-col-reverse sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="h-10 rounded-xl"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" className="h-10 rounded-xl font-semibold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Cadastrar Atividade'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
