import { useParams, useNavigate } from 'react-router-dom';
import { BookMarked, ChevronRight } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ActionCard } from '@/components/ui/ActionCard';
import { getSemesterById, getCourseById } from '@/data/courses';

export function Materias() {
  const { courseId, periodId, semesterId } = useParams();
  const navigate = useNavigate();
  
  const course = getCourseById(courseId || '');
  const semester = getSemesterById(courseId || '', semesterId || '');

  if (!course || !semester) {
    return <div className="p-8 text-center text-slate-500">Informações não encontradas.</div>;
  }

  const periodText = periodId === 'diurno' ? 'Diurno' : 'Noturno';

  return (
    <PageTransition>
      <div className="mb-10 text-center md:text-left animate-in-fade">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Matérias do {semester.name}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          <span className="font-semibold">{course.name}</span> • {periodText}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {semester.subjects.map((subject, index) => {
          const pendingCount = subject.activities?.filter(
            a => a.status === 'pending' || a.status === 'late'
          ).length || 0;

          return (
            <ActionCard
              key={subject.id}
              title={subject.name}
              icon={<BookMarked className="w-8 h-8 text-indigo-500" />}
              delay={index * 0.05}
              onClick={() => navigate(`/${course.id}/${periodId}/${semester.id}/${subject.id}/atividades`)}
            >
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                  pendingCount > 0 
                  ? 'bg-rose-100 text-rose-600' 
                  : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {pendingCount} pendência{pendingCount !== 1 ? 's' : ''}
                </span>
              </div>
            </ActionCard>
          );
        })}
      </div>
    </PageTransition>
  );
}
