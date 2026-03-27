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
      <div className="mb-6 sm:mb-8 lg:mb-10 animate-in-fade space-y-3">
        <div className="faixa-label">02 / Período</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.05]">
          {course.name}: escolha o turno.
        </h1>
        <div className="divider-strong" />
        <p className="text-sm sm:text-base font-mono text-ink/80">
          Curso: {course.name} • Código: {course.id.toUpperCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <ActionCard
          title="Diurno"
          badge="01"
          icon={<Sun className="w-8 h-8 text-amber-500" />}
          delay={0.1}
          onClick={() => navigate(`/${course.id}/diurno/semestres`)}
        />

        <ActionCard
          title="Noturno"
          badge="02"
          icon={<Moon className="w-8 h-8 text-slate-600" />}
          delay={0.2}
          onClick={() => navigate(`/${course.id}/noturno/semestres`)}
        />
      </div>
    </PageTransition>
  );
}
