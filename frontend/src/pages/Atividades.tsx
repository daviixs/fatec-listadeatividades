import { useParams } from 'react-router-dom';
import { PlusCircle, Calendar, Clock, CheckCircle } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { getSubjectById, getSemesterById, getCourseById } from '@/data/courses';
import { Button } from '@/components/ui/button';

export function Atividades() {
  const { courseId, periodId, semesterId, subjectId } = useParams();
  
  const course = getCourseById(courseId || '');
  const semester = getSemesterById(courseId || '', semesterId || '');
  const subject = getSubjectById(courseId || '', semesterId || '', subjectId || '');

  if (!course || !semester || !subject) {
    return <div className="p-8 text-center text-slate-500">Informações não encontradas.</div>;
  }

  const hasActivities = subject.activities && subject.activities.length > 0;

  return (
    <PageTransition>
      <div className="mb-10 animate-in-fade">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Atividades
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
          {subject.name}
        </p>
      </div>

      {!hasActivities ? (
        <div className="flex flex-col items-center justify-center p-12 mt-10 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed animate-in-fade">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
            <Calendar className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Nenhuma atividade cadastrada
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8">
            Você ainda não possui atividades registradas para esta matéria. Cadastre agora para acompanhar seu progresso.
          </p>
          
          <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all font-semibold px-8 h-12 gap-2 cursor-pointer">
            <PlusCircle className="w-5 h-5" />
            Cadastrar Atividade
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Keep track of your current and completed lessons.</h2>
            <div className="flex gap-3">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 h-10 w-64 shadow-sm">
                <span className="text-slate-400 mr-2 text-sm">🔍</span>
                <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm w-full" />
              </div>
              <Button variant="outline" className="border-slate-200 text-slate-600 font-bold rounded-xl h-10 gap-2 shadow-sm">
                <span>≡</span> Filters
              </Button>
              <Button size="sm" variant="default" className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl gap-1.5 h-10 font-bold shadow-sm">
                <PlusCircle className="w-4 h-4" />
                Nova
              </Button>
            </div>
          </div>
          
          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Lesson name</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Date</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Duration</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Category</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Instructor</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm">Child</th>
                  <th className="py-4 px-6 font-bold text-slate-800 text-sm rounded-tr-2xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subject.activities?.map((activity, index) => (
                  <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-indigo-900 flex items-center gap-3">
                      {activity.status === 'pending' || activity.status === 'late' ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0"></span>
                      )}
                      {activity.title}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{activity.deadline || '20/10/24'}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">20 minutes</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{subject.name}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">Teacher</td>
                    <td className="py-4 px-6 text-sm text-slate-600">Jacob</td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        activity.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {activity.status === 'completed' ? 'Completed' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
