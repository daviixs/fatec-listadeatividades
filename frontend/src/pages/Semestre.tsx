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

  // Formatting period text
  const periodText = periodId === 'diurno' ? 'Diurno' : periodId === 'noturno' ? 'Noturno' : '';

  return (
    <PageTransition>
      <div className="mb-10 text-center md:text-left animate-in-fade">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Selecione o Semestre
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Curso <span className="font-medium text-slate-800 dark:text-slate-200">{course.name}</span> • Período <span className="font-medium text-slate-800 dark:text-slate-200">{periodText}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {course.semesters.map((semester, index) => {
          // Extrai o número do semestre da string, ex: "1º semestre" -> "1"
          const semNum = semester.name.match(/\d+/)?.[0] || String(index + 1);
          
          return (
            <ActionCard
              key={semester.id}
              title={`${semNum}º Semestre`}
              delay={index * 0.05}
              onClick={() => navigate(`/${course.id}/${periodId}/${semester.id}/materias`)}
            >
              <span className="text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md text-xs">
                {semester.subjects.length} Lessons
              </span>
            </ActionCard>
          );
        })}
      </div>
    </PageTransition>
  );
}
