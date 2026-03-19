import { useNavigate } from 'react-router-dom';
import { BookOpen, Monitor, Factory, Users } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ActionCard } from '@/components/ui/ActionCard';
import { courses } from '@/data/courses';

const iconMap: Record<string, React.ReactNode> = {
  ads: <Monitor className="w-8 h-8 text-primary-500" />,
  dsm: <BookOpen className="w-8 h-8 text-secondary-500" />,
  gpi: <Factory className="w-8 h-8 text-primary-500" />,
  grh: <Users className="w-8 h-8 text-secondary-500" />,
};

export function Home() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="mb-10 text-center md:text-left animate-in-fade">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary-700 mb-3">
          Olá, Discente! 👋
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Selecione o seu curso para visualizar as atividades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <ActionCard
            key={course.id}
            title={course.name}
            icon={iconMap[course.id] || <BookOpen className="w-8 h-8 text-primary-500" />}
            delay={index * 0.1}
            onClick={() => navigate(`/${course.id}/periodo`)}
          >
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-indigo-900/70 text-sm font-bold leading-tight line-clamp-2">{course.fullName}</span>
              {course.description && (
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
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
