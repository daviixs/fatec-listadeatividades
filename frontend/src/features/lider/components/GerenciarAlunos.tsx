import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchAlunos, cadastrarAluno, excluirAluno } from '@/features/lider/alunosSlice';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Users, Trash2, Loader2, UserPlus } from 'lucide-react';

export default function GerenciarAlunos() {
  const dispatch = useAppDispatch();
  const { salaId } = useAppSelector((s) => s.auth);
  const { lista: alunos, loading } = useAppSelector((s) => s.alunos);
  const [rm, setRm] = useState('');
  const [nome, setNome] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (salaId) {
      dispatch(fetchAlunos(salaId));
    }
  }, [dispatch, salaId]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salaId) return;

    setSubmitting(true);
    try {
      await dispatch(
        cadastrarAluno({ salaId, data: { rm, nome } })
      ).unwrap();
      toast.success('Aluno cadastrado com sucesso!');
      setRm('');
      setNome('');
    } catch {
      // Erro tratado pelo interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleExcluir = async (alunoId: number) => {
    if (!salaId) return;
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;

    try {
      await dispatch(excluirAluno({ salaId, alunoId })).unwrap();
      toast.success('Aluno excluído com sucesso!');
    } catch {
      // Erro tratado pelo interceptor
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Gerenciar Alunos</h2>

      {/* Formulário de cadastro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Cadastrar Novo Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCadastrar}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 space-y-1">
              <Label htmlFor="rm-cadastro">RM</Label>
              <Input
                id="rm-cadastro"
                placeholder="RM do aluno"
                value={rm}
                onChange={(e) => setRm(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="nome-cadastro">Nome</Label>
              <Input
                id="nome-cadastro"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Cadastrar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de alunos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Alunos
            </CardTitle>
            <Badge variant="outline">Total: {alunos.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : alunos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <p>Nenhum aluno cadastrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RM</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunos.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-mono">
                        {aluno.rm}
                      </TableCell>
                      <TableCell>{aluno.nome}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleExcluir(aluno.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
