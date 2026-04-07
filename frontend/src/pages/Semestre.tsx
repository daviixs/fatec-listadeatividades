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
      <div className="mb-6 sm:mb-8 lg:mb-10 animate-in-fade space-y-3">
        <div className="faixa-label">03 / Escolha o semestre</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.05]">
          {course.name} • {periodText}
        </h1>
        <div className="divider-strong" />
        <p className="text-sm sm:text-base font-mono text-ink/80">
          Escolha o semestre para ver as matérias e as datas da sua turma.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {course.semesters.map((semester, index) => {
          const semNum = semester.name.match(/\d+/)?.[0] || String(index + 1);

          return (
            <ActionCard
              key={semester.id}
              title={`${semNum}º`}
              badge={String(index + 1).padStart(2, '0')}
              delay={index * 0.05}
              onClick={() => navigate(`/${course.id}/${periodId}/${semester.id}`)}
            >
              <span className="badge-brutal" data-variant="outline">
                {semester.subjects.length} matéria{semester.subjects.length !== 1 ? 's' : ''}
              </span>
            </ActionCard>
          );
        })}
      </div>
    </PageTransition>
  );
}
