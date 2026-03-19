import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlusCircle, Calendar, CheckCircle, Loader2, AlertTriangle, ThumbsUp, ThumbsDown, ShieldCheck, XCircle } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { getCourseById, getSemesterById, getSubjectById } from '@/data/courses';
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
import studentApi, { type MateriaApiResponse } from '@/lib/studentApi';
import { normalizeText, resolveCandidateSalasFromRoute } from '@/lib/routeResolver';
import { TipoAtividade, TipoEntrega, type Atividade } from '@/types/admin';
import type { VotacaoCancelamento } from '@/types';
import { Progress } from '@/components/ui/progress';

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

function resolveMateriaFromName(materias: MateriaApiResponse[], subjectName: string): MateriaApiResponse | null {
  const normalizedTarget = normalizeText(subjectName);
  return materias.find((materia) => normalizeText(materia.nome) === normalizedTarget) || null;
}

function resolveMateriaByLegacyIndex(
  materias: MateriaApiResponse[],
  legacySubjectId: string,
  legacySemesterSubjectIds: string[]
): MateriaApiResponse | null {
  const subjectIndex = legacySemesterSubjectIds.findIndex((id) => id === legacySubjectId);
  if (subjectIndex < 0 || subjectIndex >= materias.length) {
    return null;
  }
  return materias[subjectIndex] || null;
}

export function Atividades() {
  const { courseId, periodId, semesterId, subjectId } = useParams();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [materia, setMateria] = useState<MateriaApiResponse | null>(null);
  const [salaNome, setSalaNome] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ActivityFormState>(initialFormState);
  const [votacoes, setVotacoes] = useState<Record<number, VotacaoCancelamento | null>>({});
  const [votandoId, setVotandoId] = useState<number | null>(null);
  const [jaVotou, setJaVotou] = useState<Record<number, boolean>>({});

  const course = getCourseById(courseId || '');
  const semester = getSemesterById(courseId || '', semesterId || '');
  const legacySubject = getSubjectById(courseId || '', semesterId || '', subjectId || '');

  const numericMateriaId = useMemo(() => {
    if (!subjectId) {
      return null;
    }

    const parsedId = Number(subjectId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return null;
    }

    return parsedId;
  }, [subjectId]);

  const formattedSemester = useMemo(() => semester?.name || `${semesterId}º semestre`, [semester, semesterId]);
  const formattedPeriod = periodId === 'diurno' ? 'Diurno' : 'Noturno';

  const subjectLabel = materia?.nome || legacySubject?.name || 'Matéria';
  const subtitleLabel = salaNome || `${course?.name || ''} • ${formattedPeriod} • ${formattedSemester}`;

  useEffect(() => {
    const loadData = async () => {
      if (!courseId || !periodId || !semesterId || !subjectId || !course) {
        setErrorMessage('Informações da rota não encontradas.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        if (numericMateriaId) {
          const [materiaData, atividadesData] = await Promise.all([
            studentApi.getMateriaById(numericMateriaId),
            studentApi.getAtividadesPorMateria(numericMateriaId),
          ]);

          setMateria(materiaData);
          setSalaNome(materiaData.salaNome);
          setAtividades(atividadesData);
          await carregarVotacoes(atividadesData);
          return;
        }

        if (!legacySubject || !semester) {
          setErrorMessage('Informações da matéria não encontradas para esta rota.');
          return;
        }

        const salas = await studentApi.getSalas();
        const candidateSalas = resolveCandidateSalasFromRoute(salas, courseId, periodId, semesterId);

        if (candidateSalas.length === 0) {
          setErrorMessage('Não foi possível identificar a sala desta rota.');
          return;
        }

        const legacySemesterSubjectIds = semester.subjects.map((subject) => subject.id);

        const candidateSalaMateria = await Promise.all(
          candidateSalas.map(async (sala) => {
            const materiasDaSala = await studentApi.getMateriasPorSala(sala.id);

            const materiaFromName = resolveMateriaFromName(materiasDaSala, legacySubject.name);
            if (materiaFromName) {
              return { salaNome: sala.nome, materia: materiaFromName };
            }

            const materiaFromIndex = resolveMateriaByLegacyIndex(
              materiasDaSala,
              subjectId,
              legacySemesterSubjectIds
            );
            return { salaNome: sala.nome, materia: materiaFromIndex };
          })
        );

        const resolvedPair = candidateSalaMateria.find((item) => item.materia !== null);

        if (!resolvedPair?.materia) {
          setErrorMessage('Não foi possível localizar a matéria desta rota. Abra novamente pela lista de matérias.');
          return;
        }

        setMateria(resolvedPair.materia);
        setSalaNome(resolvedPair.salaNome);

        const atividadesData = await studentApi.getAtividadesPorMateria(resolvedPair.materia.id);
        setAtividades(atividadesData);
        await carregarVotacoes(atividadesData);
      } catch {
        setErrorMessage('Não foi possível carregar os dados desta matéria no momento.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [course, courseId, legacySubject, numericMateriaId, periodId, semester, semesterId, subjectId]);

  const loadAtividades = async (materiaId: number) => {
    const data = await studentApi.getAtividadesPorMateria(materiaId);
    setAtividades(data);
    await carregarVotacoes(data);
  };

  const carregarVotacoes = async (lista: Atividade[]) => {
    const entries = await Promise.all(
      lista.map(async (atividade) => {
        try {
          const data = await studentApi.getVotacaoPorAtividade(atividade.id);
          return [atividade.id, data] as const;
        } catch {
          return [atividade.id, null] as const;
        }
      })
    );
    const novoMapa: Record<number, VotacaoCancelamento | null> = {};
    const marcou: Record<number, boolean> = {};
    entries.forEach(([id, votacao]) => {
      novoMapa[id] = votacao;
      if (votacao?.jaVotou) {
        marcou[id] = true;
      }
    });
    setVotacoes(novoMapa);
    if (Object.keys(marcou).length) {
      setJaVotou((prev) => ({ ...prev, ...marcou }));
    }
  };

  const atualizarVotacao = async (atividadeId: number) => {
    try {
      const data = await studentApi.getVotacaoPorAtividade(atividadeId);
      setVotacoes((prev) => ({ ...prev, [atividadeId]: data }));
      if (data?.jaVotou) {
        setJaVotou((prev) => ({ ...prev, [atividadeId]: true }));
      }
    } catch {
      setVotacoes((prev) => ({ ...prev, [atividadeId]: null }));
    }
  };

  const enviarVoto = async (atividadeId: number, opcao: 'SIM' | 'NAO') => {
    setVotandoId(atividadeId);
    try {
      await studentApi.registrarVoto(atividadeId, { opcao });
      toast.success('Voto registrado. Obrigado por participar.');
    } catch (error) {
      // erro já tratado globalmente; tenta exibir parciais mesmo assim
    } finally {
      await atualizarVotacao(atividadeId);
      if (materia) {
        await loadAtividades(materia.id);
      }
      setVotandoId(null);
      setJaVotou((prev) => ({ ...prev, [atividadeId]: true }));
    }
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
    } catch {
      toast.error('Não foi possível criar a atividade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course || !semester) {
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
        <div className="flex flex-col items-center justify-center p-12 mt-10 rounded-3xl bg-white border-2 border-slate-200/70">
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
  const votacoesAbertas = atividades
    .map((atividade) => ({ atividade, votacao: votacoes[atividade.id] }))
    .filter(({ atividade, votacao }) => atividade.status === 'ATIVA' && votacao && votacao.status === 'ABERTA');

  return (
    <PageTransition>
      <div className="mb-10 animate-in-fade">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-700 mb-3">
          Atividades
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
          {subjectLabel} • {subtitleLabel}
        </p>
      </div>

      {!hasActivities ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200/60 bg-white p-12 mt-10 animate-in-fade">
          <div className="absolute -top-10 -right-8 w-36 h-36 bg-indigo-100/60 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-rose-100/50 rounded-full blur-2xl" />

          <div className="relative flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 text-slate-500 shadow-inner">
              <Calendar className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-indigo-950 mb-2">Nenhuma atividade cadastrada</h2>
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
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {new Date(activity.prazo).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {activity.tipoEntrega === 'LINK_EXTERNO' ? 'Link Externo' : 'Entrega Manual'}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {activity.materiaNome || materia?.nome || legacySubject?.name || '-'}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          activity.statusAprovacao === 'APROVADA'
                            ? 'bg-emerald-100 text-emerald-700'
                            : activity.statusAprovacao === 'PENDENTE'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                        }`}
                      >
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

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-800">Votações abertas</h3>
            </div>

            {votacoesAbertas.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
                Nenhuma votação ativa nesta matéria no momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {votacoesAbertas.map(({ atividade, votacao }) => {
                  if (!votacao) return null;
                  const total = votacao.votosSim + votacao.votosNao;
                  const percentSim = total > 0 ? Math.round((votacao.votosSim / total) * 100) : 0;
                  const percentNao = total > 0 ? Math.round((votacao.votosNao / total) * 100) : 0;
                  const encerraEm = new Date(votacao.encerraEm).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  });
                  const bloqueado = jaVotou[atividade.id] || votacao.jaVotou;
                  const cancelada = votacao.cancelado || atividade.status === 'CANCELADA';

                  return (
                    <div
                      key={atividade.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">
                            {atividade.materiaNome || materia?.nome || '-'}
                          </p>
                          <h4 className="text-lg font-bold text-slate-900 leading-tight">{atividade.titulo}</h4>
                          <p className="text-sm text-slate-600">
                            Prazo: {new Date(atividade.prazo).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        {cancelada && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                            <XCircle className="w-4 h-4" />
                            Cancelada
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500">
                        Fecha em {encerraEm} • Meta de cancelamento: {votacao.metaCancelamento} votos SIM
                      </div>

                      {!bloqueado ? (
                        <div className="flex flex-wrap gap-3">
                          <Button
                            className="rounded-xl gap-2"
                            disabled={votandoId === atividade.id}
                            onClick={() => enviarVoto(atividade.id, 'SIM')}
                          >
                            {votandoId === atividade.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ThumbsUp className="w-4 h-4" />
                            )}
                            Confirmar que o professor passou
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl gap-2"
                            disabled={votandoId === atividade.id}
                            onClick={() => enviarVoto(atividade.id, 'NAO')}
                          >
                            {votandoId === atividade.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ThumbsDown className="w-4 h-4" />
                            )}
                            Não passou
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1">
                              <span className="flex items-center gap-1 text-emerald-700">
                                <ThumbsUp className="w-4 h-4" />
                                Sim ({votacao.votosSim})
                              </span>
                              <span>{percentSim}%</span>
                            </div>
                            <Progress value={percentSim} className="h-2 bg-emerald-100" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1">
                              <span className="flex items-center gap-1 text-rose-700">
                                <ThumbsDown className="w-4 h-4" />
                                Não ({votacao.votosNao})
                              </span>
                              <span>{percentNao}%</span>
                            </div>
                            <Progress value={percentNao} className="h-2 bg-rose-100" />
                          </div>
                          <p className="text-xs text-slate-600">
                            Total de votos: {total}. Você já votou e pode acompanhar o resultado.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-extrabold text-primary-700">Nova Atividade</DialogTitle>
            <DialogDescription className="text-slate-600">
              Preencha os dados para cadastrar uma nova atividade em {subjectLabel}.
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
