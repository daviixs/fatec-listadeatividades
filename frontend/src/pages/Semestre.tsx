import { useParams, useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';
import { ActionCard } from '@/components/ui/ActionCard';
import { getCourseById } from '@/data/courses';

export function Semestre() {
  const { courseId, periodId } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(courseId || '');

  if (!course) {
    return <div className="p-8 text-center text-slate-500">Curso não encontrado.</div>;
  }

  const periodText = periodId === 'diurno' ? 'Diurno' : periodId === 'noturno' ? 'Noturno' : '';

  return (
    <PageTransition>
      <div className="mb-6 sm:mb-8 lg:mb-10 text-center md:text-left animate-in-fade">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-3">
          Selecione o Semestre
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400">
          Curso <span className="font-medium text-slate-800 dark:text-slate-200">{course.name}</span> • Período <span className="font-medium text-slate-800 dark:text-slate-200">{periodText}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {course.semesters.map((semester, index) => {
          const semNum = semester.name.match(/\d+/)?.[0] || String(index + 1);

          return (
            <ActionCard
              key={semester.id}
              title={`${semNum}º`}
              delay={index * 0.05}
              onClick={() => navigate(`/${course.id}/${periodId}/${semester.id}`)}
            >
              <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded-md text-xs">
                {semester.subjects.length} matéria{semester.subjects.length !== 1 ? 's' : ''}
              </span>
            </ActionCard>
          );
        })}
      </div>
    </PageTransition>
  );
}
