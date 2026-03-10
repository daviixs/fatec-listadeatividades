import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  fetchAtividades,
  criarAtividade,
  atualizarAtividade,
  excluirAtividade,
} from '@/features/atividade/atividadesSlice';
import { fetchMaterias } from '@/features/aluno/materiasSlice';
import { abrirVotacao } from '@/features/atividade/votacaoSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Vote,
  Loader2,
  Calendar,
  AlertTriangle,
  X,
} from 'lucide-react';
import type { Atividade, AtividadeRequest } from '@/types';

export default function GerenciarAtividades() {
  const dispatch = useAppDispatch();
  const { salaId } = useAppSelector((s) => s.auth);
  const { lista: atividades, loading } = useAppSelector((s) => s.atividades);
  const { lista: materias } = useAppSelector((s) => s.materias);

  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Atividade | null>(null);
  const [votacaoModal, setVotacaoModal] = useState<Atividade | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filtros
  const [filtroMateria, setFiltroMateria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todas');

  // Form fields
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState<'LINK_EXTERNO' | 'ENTREGA_MANUAL'>('ENTREGA_MANUAL');
  const [linkEntrega, setLinkEntrega] = useState('');
  const [regrasEntrega, setRegrasEntrega] = useState('');
  const [prazo, setPrazo] = useState('');
  const [materiaId, setMateriaId] = useState('');

  useEffect(() => {
    dispatch(fetchAtividades());
    if (salaId) {
      dispatch(fetchMaterias(salaId));
    }
  }, [dispatch, salaId]);

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setTipoEntrega('ENTREGA_MANUAL');
    setLinkEntrega('');
    setRegrasEntrega('');
    setPrazo('');
    setMateriaId('');
    setEditando(null);
    setShowForm(false);
  };

  const handleEditar = (atividade: Atividade) => {
    setEditando(atividade);
    setTitulo(atividade.titulo);
    setDescricao(atividade.descricao);
    setTipoEntrega(atividade.tipoEntrega);
    setLinkEntrega(atividade.linkEntrega || '');
    setRegrasEntrega(atividade.regrasEntrega || '');
    setPrazo(atividade.prazo ? atividade.prazo.split('T')[0] : '');
    setMateriaId(String(atividade.materiaId));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data: AtividadeRequest = {
      titulo,
      descricao,
      tipoEntrega,
      linkEntrega: tipoEntrega === 'LINK_EXTERNO' ? linkEntrega : undefined,
      regrasEntrega: regrasEntrega || undefined,
      prazo,
      materiaId: Number(materiaId),
    };

    try {
      if (editando) {
        await dispatch(
          atualizarAtividade({ id: editando.id, data })
        ).unwrap();
        toast.success('Atividade atualizada com sucesso!');
      } else {
        await dispatch(criarAtividade(data)).unwrap();
        toast.success('Atividade criada com sucesso!');
      }
      resetForm();
    } catch {
      // Erro tratado pelo interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta atividade?')) return;
    try {
      await dispatch(excluirAtividade(id)).unwrap();
      toast.success('Atividade excluída com sucesso!');
    } catch {
      // Erro tratado pelo interceptor
    }
  };

  const handleAbrirVotacao = async () => {
    if (!votacaoModal) return;
    setSubmitting(true);
    try {
      await dispatch(abrirVotacao(votacaoModal.id)).unwrap();
      toast.success('Votação aberta com sucesso!');
      setVotacaoModal(null);
    } catch {
      // Erro tratado pelo interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const atividadesFiltradas = atividades.filter((a) => {
    const matchMateria =
      filtroMateria === 'todas' || a.materiaId === Number(filtroMateria);
    const matchStatus =
      filtroStatus === 'todas' || a.status === filtroStatus;
    return matchMateria && matchStatus;
  });

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Gerenciar Atividades
        </h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Nova Atividade
            </>
          )}
        </Button>
      </div>

      {/* Formulário de criação/edição */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editando ? 'Editar Atividade' : 'Criar Nova Atividade'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    placeholder="Título da atividade"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materiaId">Matéria</Label>
                  <Select value={materiaId} onValueChange={(v) => v && setMateriaId(v)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      {materias.map((m) => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição detalhada da atividade"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipoEntrega">Tipo de Entrega</Label>
                  <Select
                    value={tipoEntrega}
                    onValueChange={(v) =>
                      setTipoEntrega(v as 'LINK_EXTERNO' | 'ENTREGA_MANUAL')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENTREGA_MANUAL">
                        Entrega Manual
                      </SelectItem>
                      <SelectItem value="LINK_EXTERNO">
                        Link Externo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo</Label>
                  <Input
                    id="prazo"
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    required
                  />
                </div>
              </div>

              {tipoEntrega === 'LINK_EXTERNO' && (
                <div className="space-y-2">
                  <Label htmlFor="linkEntrega">Link de Entrega</Label>
                  <Input
                    id="linkEntrega"
                    placeholder="https://..."
                    value={linkEntrega}
                    onChange={(e) => setLinkEntrega(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="regrasEntrega">Regras de Entrega</Label>
                <Textarea
                  id="regrasEntrega"
                  placeholder="Regras e orientações para entrega (opcional)"
                  value={regrasEntrega}
                  onChange={(e) => setRegrasEntrega(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editando ? (
                    'Atualizar'
                  ) : (
                    'Criar Atividade'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={filtroMateria} onValueChange={(v) => v && setFiltroMateria(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por matéria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as matérias</SelectItem>
            {materias.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtroStatus} onValueChange={(v) => v && setFiltroStatus(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos os status</SelectItem>
            <SelectItem value="ATIVA">Ativas</SelectItem>
            <SelectItem value="CANCELADA">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de atividades */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : atividadesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <ClipboardList className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p>Nenhuma atividade encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {atividadesFiltradas.map((atividade) => (
            <Card key={atividade.id}>
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{atividade.titulo}</h3>
                      <Badge
                        variant={
                          atividade.status === 'ATIVA'
                            ? 'default'
                            : 'destructive'
                        }
                        className={
                          atividade.status === 'ATIVA'
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : ''
                        }
                      >
                        {atividade.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {atividade.descricao}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Prazo: {formatDate(atividade.prazo)}
                      </span>
                      <span>
                        {atividade.tipoEntrega === 'LINK_EXTERNO'
                          ? 'Link externo'
                          : 'Entrega manual'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {atividade.status === 'ATIVA' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-500 border-blue-200 hover:bg-blue-50"
                        onClick={() => setVotacaoModal(atividade)}
                      >
                        <Vote className="h-4 w-4 mr-1" />
                        Abrir Votação
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditar(atividade)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleExcluir(atividade.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Abertura de Votação */}
      <Dialog
        open={!!votacaoModal}
        onOpenChange={(open) => !open && setVotacaoModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir Votação de Cancelamento</DialogTitle>
            <DialogDescription>
              Confirme a abertura de uma votação para esta atividade.
            </DialogDescription>
          </DialogHeader>

          {votacaoModal && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Atividade:</span>{' '}
                  {votacaoModal.titulo}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Prazo:</span>{' '}
                  {formatDate(votacaoModal.prazo)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Período: 12 horas a partir de agora
                </p>
              </div>

              <Alert className="border-amber-500 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-700">
                  Esta ação iniciará uma votação de 12 horas para cancelamento
                  desta atividade. A atividade será cancelada se 80% dos alunos
                  votarem SIM.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVotacaoModal(null)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAbrirVotacao} disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Vote className="h-4 w-4 mr-1" />
                  Abrir Votação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
