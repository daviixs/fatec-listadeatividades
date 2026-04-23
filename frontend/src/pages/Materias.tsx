import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, BookMarked, CheckCircle2, Loader2, Mail, X } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ActionCard } from '@/components/ui/ActionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { getCourseById, getSemesterById } from '@/data/courses';
import studentApi, { type MateriaApiResponse, type SalaApiResponse } from '@/lib/studentApi';
import { resolveSalaFromRoute } from '@/lib/routeResolver';
import { toast } from 'sonner';

export function Materias() {
  const { courseId, periodId, semesterId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sala, setSala] = useState<SalaApiResponse | null>(null);
  const [materias, setMaterias] = useState<MateriaApiResponse[]>([]);

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      } catch (err) {
        console.error('Erro ao carregar matérias:', err);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar as matérias desta sala no momento.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadMaterias();
  }, [courseId, periodId, semesterId]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !sala) {
      toast.error('Informe um e-mail para continuar.');
      return;
    }

    setIsSubmitting(true);
    try {
      await studentApi.cadastrarLembrete({
        email: email.trim(),
        salaIds: [sala.id],
      });
      setEmail('');
      setShowSuccessModal(true);
    } catch {
      toast.error('Não foi possível salvar esse e-mail. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!course || !semester) {
    return <div className="p-8 text-center text-slate-500">Informações não encontradas.</div>;
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-slate-600 mb-4" />
          <p className="text-slate-600 font-medium text-sm sm:text-base">Carregando matérias...</p>
        </div>
      </PageTransition>
    );
  }

  if (errorMessage) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 mt-6 sm:mt-10 rounded-3xl bg-white border-2 border-slate-200/70">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 sm:mb-5">
            <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-2">Não foi possível abrir esta página</h2>
          <p className="text-slate-600 text-center max-w-lg text-sm sm:text-base">{errorMessage}</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mb-6 sm:mb-8 lg:mb-10 text-center md:text-left animate-in-fade">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-3">
              Matérias do {formattedSemester}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{course.name}</span> • {periodText}
              {sala?.nome ? ` • ${sala.nome}` : ''}
            </p>
          </div>
          {sala && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-slate-600" />
                <span className="font-semibold text-slate-700 text-sm">Receber avisos por e-mail</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Informe seu e-mail para receber avisos sobre novas atividades e prazos desta sala.
              </p>
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-10 sm:h-9 text-sm"
                />
                <Button type="submit" size="sm" disabled={isSubmitting} className="h-10 sm:h-9 bg-slate-800 hover:bg-slate-900">
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Salvar e-mail'
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {materias.length === 0 ? (
        <div className="rounded-2xl bg-white border-2 border-slate-200/60 p-6 sm:p-8 text-center text-slate-600 font-semibold text-sm sm:text-base">
          Nenhuma matéria encontrada para esta sala.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {materias.map((materia, index) => (
            <ActionCard
              key={materia.id}
              title={materia.nome}
              icon={<BookMarked className="w-8 h-8 text-slate-600" />}
              delay={index * 0.05}
              onClick={() => navigate(`/${course.id}/${periodId}/${semester.id}/${materia.id}/atividades`)}
            >
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                  {materia.professor}
                </span>
              </div>
            </ActionCard>
          ))}
        </div>
      )}

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 max-h-[90vh] overflow-y-auto">
          <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-5 sm:p-6 text-white text-center">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Tudo certo!</h2>
            <p className="text-green-100 text-xs sm:text-sm">Seu e-mail foi salvo com sucesso.</p>
          </div>
          <div className="p-5 sm:p-6 bg-white">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1 text-sm sm:text-base">Você vai receber avisos por e-mail</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  De tempos em tempos, enviaremos notificações sobre as <strong>atividades pendentes</strong> desta sala para que você não perca nenhum prazo importante.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1 text-sm sm:text-base">Fique atento a sua caixa de entrada</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Os emails serão enviados periodicamente com um resumo das atividades que estão próximas do vencimento.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full mt-5 sm:mt-6 bg-slate-800 hover:bg-slate-900 h-11 sm:h-12"
            >
              Entendi!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
