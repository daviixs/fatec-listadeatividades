import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCursoPorNome } from '@/features/cursos/cursosSlice';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import type { Materia, Atividade } from '@/types';

export default function SemestreDetalhesPage() {
  const { cursoNome, turno, semestre } = useParams<{ cursoNome: string; turno: string; semestre: string }>();
  const dispatch = useAppDispatch();
  const { cursoSelecionado, loading: loadingCurso } = useAppSelector((s) => s.cursos);
  const { aluno } = useAppSelector((s) => s.auth);

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(false);
  const [salaId, setSalaId] = useState<number | null>(null);
  const [atividadesPorMateria, setAtividadesPorMateria] = useState<Record<number, Atividade[]>>({});
  const [loadingAtividades, setLoadingAtividades] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (cursoNome) {
      dispatch(fetchCursoPorNome(cursoNome));
    }
  }, [dispatch, cursoNome]);

  useEffect(() => {
    if (cursoSelecionado && semestre && turno) {
      const salaEncontrada = cursoSelecionado.semestres.find(s =>
        s.semestre === `${semestre}°` &&
        s.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(turno.toLowerCase())
      );

      if (salaEncontrada) {
        setSalaId(salaEncontrada.id);
        fetchMateriasDaSala(salaEncontrada.id);
      }
    }
  }, [cursoSelecionado, semestre, turno]);

  const fetchMateriasDaSala = async (id: number) => {
    setLoading(true);
    try {
      const response = await api.get<Materia[]>(`/salas/${id}/materias`);
      setMaterias(response.data);

      response.data.forEach((materia) => {
        fetchAtividadesDaMateria(materia.id);
      });
    } catch (error) {
      console.error('Erro ao buscar matérias:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAtividadesDaMateria = async (materiaId: number) => {
    setLoadingAtividades(prev => ({ ...prev, [materiaId]: true }));
    try {
      const response = await api.get<Atividade[]>(`/materias/${materiaId}/atividades`);
      setAtividadesPorMateria(prev => ({
        ...prev,
        [materiaId]: response.data
      }));
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    } finally {
      setLoadingAtividades(prev => ({ ...prev, [materiaId]: false }));
    }
  };

  const getAtividadesPendentes = (materiaId: number): number => {
    const atividades = atividadesPorMateria[materiaId] || [];
    return atividades.filter(a => a.status === 'ATIVA').length;
  };

  const turnoFormatado = turno === 'manha' ? 'Manhã' : 'Noite';
  const semestreFormatado = `${semestre}° Semestre`;

  if (loading || loadingCurso) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to={`/cursos/${cursoNome}/${turno}`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar para {cursoNome?.toUpperCase()} - {turnoFormatado}
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex-1">
          {cursoNome?.toUpperCase()} - {semestreFormatado}
        </h1>
      </div>

      {materias.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-600">Nenhuma matéria cadastrada neste semestre.</p>
            {!aluno && (
              <p className="text-sm text-gray-500 mt-2">
                Faça login para acessar mais informações.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Matérias</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materias.map((materia) => {
              const pendentes = getAtividadesPendentes(materia.id);
              return (
                <Link
                  key={materia.id}
                  to={`/cursos/${cursoNome}/${turno}/${semestre}/materias/${materia.id}`}
                >
                  <Card className="cursor-pointer card-hover rounded-2xl border-0 bg-white relative">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-br from-[#5A7C7A] to-[#6B9B7A] text-white p-2 rounded-xl shadow-lg">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-lg">{materia.nome}</CardTitle>
                        </div>
                        {loadingAtividades[materia.id] ? (
                          <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full animate-pulse">
                            ...
                          </div>
                        ) : (
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            pendentes > 0
                              ? 'bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {pendentes} pendentes
                          </div>
                        )}
                      </div>
                      <CardDescription>Professor: {materia.professor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Clique para ver as atividades
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}