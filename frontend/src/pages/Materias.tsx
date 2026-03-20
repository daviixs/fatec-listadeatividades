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

  // Email subscription state
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
        // Log detalhado para depuração (apenas console)
        console.error('Erro ao carregar matérias:', err);
        setErrorMessage('Não foi possível carregar as matérias desta sala no momento.');
      } finally {
        setLoading(false);
      }
    };

    loadMaterias();
  }, [courseId, periodId, semesterId]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !sala) {
      toast.error('Por favor, preencha o email.');
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
      toast.error('Erro ao cadastrar email. Tente novamente.');
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
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
          <p className="text-slate-600 font-medium">Carregando matérias...</p>
        </div>
      </PageTransition>
    );
  }

  if (errorMessage) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center p-12 mt-10 rounded-3xl bg-white border-2 border-slate-200/70">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-2">Não foi possível abrir esta página</h2>
          <p className="text-slate-600 text-center max-w-lg">{errorMessage}</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mb-10 text-center md:text-left animate-in-fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary-700 mb-3">
              Matérias do {formattedSemester}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              <span className="font-semibold">{course.name}</span> • {periodText}
              {sala?.nome ? ` • ${sala.nome}` : ''}
            </p>
          </div>
          {sala && (
            <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 w-full sm:w-auto sm:min-w-[320px]">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-primary-600" />
                <span className="font-semibold text-primary-700 text-sm">Receber avisos por email</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Cadastre seu email para receber notificações sobre novas atividades e prazos desta sala.
              </p>
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-9 text-sm"
                />
                <Button type="submit" size="sm" disabled={isSubmitting} className="h-9 border border-primary-600">
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {materias.length === 0 ? (
        <div className="rounded-2xl bg-white border-2 border-slate-200/60 p-8 text-center text-slate-600 font-semibold">
          Nenhuma matéria encontrada para esta sala.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materias.map((materia, index) => (
            <ActionCard
              key={materia.id}
              title={materia.nome}
              icon={<BookMarked className="w-8 h-8 text-indigo-500" />}
              delay={index * 0.05}
              onClick={() => navigate(`/${course.id}/${periodId}/${semester.id}/${materia.id}/atividades`)}
            >
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                  Professor: {materia.professor}
                </span>
              </div>
            </ActionCard>
          ))}
        </div>
      )}

      {/* Modal de Sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
          <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white text-center">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Parabens!</h2>
            <p className="text-green-100 text-sm">Seu email foi cadastrado com sucesso!</p>
          </div>
          <div className="p-6 bg-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Voce recebera avisos por email</h3>
                <p className="text-sm text-slate-600">
                  De tempos em tempos, enviaremos notificacoes sobre as <strong>atividades pendentes</strong> desta sala para que voce nao perca nenhum prazo importante.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Fique atento a sua caixa de entrada</h3>
                <p className="text-sm text-slate-600">
                  Os emails serao enviados periodicamente com um resumo das atividades que estao proximas do vencimento.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowSuccessModal(false)} 
              className="w-full mt-6 bg-primary-600 hover:bg-primary-700"
            >
              Entendi!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
