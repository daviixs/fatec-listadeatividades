import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bell, Loader2 } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ActionCard } from '@/components/ui/ActionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCourseById } from '@/data/courses';
import studentApi, { type SalaApiResponse } from '@/lib/studentApi';
import { resolveSalaFromCourseAndPeriod } from '@/lib/routeResolver';
import { toast } from 'sonner';

export function Semestre() {
  const { courseId, periodId } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(courseId || '');

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sala, setSala] = useState<SalaApiResponse | null>(null);
  const [loadingSala, setLoadingSala] = useState(true);

  useEffect(() => {
    const loadSala = async () => {
      if (!courseId || !periodId) return;

      try {
        const salas = await studentApi.getSalas();
        const resolvedSala = resolveSalaFromCourseAndPeriod(salas, courseId, periodId);
        setSala(resolvedSala);
      } catch (error) {
        console.error('Erro ao carregar sala:', error);
      } finally {
        setLoadingSala(false);
      }
    };

    loadSala();
  }, [courseId, periodId]);

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
      toast.success('Email cadastrado com sucesso! Você receberá avisos por email.');
      setEmail('');
      setIsEmailDialogOpen(false);
    } catch {
      toast.error('Erro ao cadastrar email. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course) {
    return <div className="p-8 text-center text-slate-500">Curso não encontrado.</div>;
  }

  const periodText = periodId === 'diurno' ? 'Diurno' : periodId === 'noturno' ? 'Noturno' : '';

  return (
    <PageTransition>
      <div className="mb-10 text-center md:text-left animate-in-fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary-700 mb-3">
              Selecione o Semestre
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Curso <span className="font-medium text-slate-800 dark:text-slate-200">{course.name}</span> • Período <span className="font-medium text-slate-800 dark:text-slate-200">{periodText}</span>
            </p>
          </div>
          {!loadingSala && sala && (
            <Button
              variant="outline"
              className="gap-2 border-primary-500/30 text-primary-700 hover:bg-primary-50 hover:border-primary-500"
              onClick={() => setIsEmailDialogOpen(true)}
            >
              <Bell className="w-4 h-4" />
              Receber Avisos
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {course.semesters.map((semester, index) => {
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

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              Receber avisos por email
            </DialogTitle>
            <DialogDescription>
              Cadastre seu email para receber notificações sobre novas atividades e prazos deste curso.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEmailDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
