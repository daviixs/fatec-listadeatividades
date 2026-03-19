import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, BookMarked, Loader2 } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ActionCard } from '@/components/ui/ActionCard';
import { getCourseById, getSemesterById } from '@/data/courses';
import studentApi, { type MateriaApiResponse, type SalaApiResponse } from '@/lib/studentApi';
import { resolveSalaFromRoute } from '@/lib/routeResolver';

export function Materias() {
  const { courseId, periodId, semesterId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sala, setSala] = useState<SalaApiResponse | null>(null);
  const [materias, setMaterias] = useState<MateriaApiResponse[]>([]);

  const course = getCourseById(courseId || '');
  const semester = getSemesterById(courseId || '', semesterId || '');

  const periodText = periodId === 'diurno' ? 'Diurno' : 'Noturno';
  const formattedSemester = useMemo(() => semester?.name || `${semesterId}º semestre`, [semester, semesterId]);

  useEffect(() => {
    const loadMaterias = async () => {
      if (!courseId || !periodId || !semesterId) {
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
          return;
        }

        const materiasData = await studentApi.getMateriasPorSala(resolvedSala.id);
        setSala(resolvedSala);
        setMaterias(materiasData);
      } catch {
        setErrorMessage('Não foi possível carregar as matérias desta sala no momento.');
      } finally {
        setLoading(false);
      }
    };

    loadMaterias();
  }, [courseId, periodId, semesterId]);

  if (!course || !semester) {
    return <div className="p-8 text-center text-slate-500">Informações não encontradas.</div>;
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
          <p className="text-slate-600 font-medium">Carregando matérias...</p>
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

  return (
    <PageTransition>
      <div className="mb-10 text-center md:text-left animate-in-fade">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary-700 mb-3">
          Matérias do {formattedSemester}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          <span className="font-semibold">{course.name}</span> • {periodText}
          {sala?.nome ? ` • ${sala.nome}` : ''}
        </p>
      </div>

      {materias.length === 0 ? (
        <div className="rounded-2xl bg-white border-2 border-slate-200/60 p-8 text-center text-slate-600 font-semibold">
          Nenhuma matéria encontrada para esta sala.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materias.map((materia, index) => (
            <ActionCard
              key={materia.id}
              title={materia.nome}
              icon={<BookMarked className="w-8 h-8 text-indigo-500" />}
              delay={index * 0.05}
              onClick={() => navigate(`/${course.id}/${periodId}/${semester.id}/${materia.id}/atividades`)}
            >
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                  Professor: {materia.professor}
                </span>
              </div>
            </ActionCard>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
