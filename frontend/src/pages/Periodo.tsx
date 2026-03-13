import { useParams, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ActionCard } from '@/components/ui/ActionCard';
import { getCourseById } from '@/data/courses';

export function Periodo() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(courseId || '');

  if (!course) {
    return <div className="p-8 text-center text-slate-500">Curso não encontrado.</div>;
  }

  return (
    <PageTransition>
      <div className="mb-10 text-center md:text-left animate-in-fade">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Qual o seu período?
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Você está navegando em <span className="font-semibold text-primary-600 dark:text-primary-400">{course.name}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ActionCard
          title="Diurno"
          icon={<Sun className="w-8 h-8 text-amber-500" />}
          delay={0.1}
          onClick={() => navigate(`/${course.id}/diurno/semestres`)}
        />

        <ActionCard
          title="Noturno"
          icon={<Moon className="w-8 h-8 text-indigo-500" />}
          delay={0.2}
          onClick={() => navigate(`/${course.id}/noturno/semestres`)}
        />
      </div>
    </PageTransition>
  );
}
