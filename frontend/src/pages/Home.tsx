import { useNavigate } from 'react-router-dom';
import { BookOpen, Monitor, Factory, Users } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ActionCard } from '@/components/ui/ActionCard';
import { courses } from '@/data/courses';

const iconMap: Record<string, React.ReactNode> = {
  ads: <Monitor className="w-8 h-8 text-slate-600" />,
  dsm: <BookOpen className="w-8 h-8 text-slate-600" />,
  gpi: <Factory className="w-8 h-8 text-slate-600" />,
  grh: <Users className="w-8 h-8 text-slate-600" />,
};

export function Home() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="mb-6 sm:mb-8 lg:mb-10 animate-in-fade space-y-3">
        <div className="faixa-label">Seu Calendário Acadêmico / Painel Discente / 2026</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.05]">
          Painel do Discente — escolha o curso e avance.
        </h1>
        <div className="divider-strong" />
        <p className="text-sm sm:text-base font-mono text-ink/80">
          Mobile-first. Atualizado diariamente. Acesso rápido a períodos, semestres e calendários.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {courses.map((course, index) => (
          <ActionCard
            key={course.id}
            title={course.name}
            badge={`0${index + 1}`}
            icon={iconMap[course.id] || <BookOpen className="w-8 h-8 text-slate-600" />}
            delay={index * 0.1}
            onClick={() => navigate(`/${course.id}/periodo`)}
          >
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-ink text-sm font-extrabold leading-tight line-clamp-2">{course.fullName}</span>
              {course.description && (
                <p className="text-[11px] sm:text-xs text-ink/70 font-mono leading-relaxed mt-1 line-clamp-2">
                  {course.description}
                </p>
              )}
            </div>
          </ActionCard>
        ))}
      </div>
    </PageTransition>
  );
}
