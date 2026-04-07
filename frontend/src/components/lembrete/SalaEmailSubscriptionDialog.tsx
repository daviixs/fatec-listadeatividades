import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import studentApi from '@/lib/studentApi';

interface SalaEmailSubscriptionDialogProps {
  salaId: number;
  salaNome: string;
}

export function SalaEmailSubscriptionDialog({
  salaId,
  salaNome,
}: SalaEmailSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail('');
      setSubmittedEmail('');
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Informe um e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedEmail = email.trim();
      await studentApi.cadastrarLembrete({
        email: normalizedEmail,
        salaIds: [salaId],
      });
      setSubmittedEmail(normalizedEmail);
      setIsSuccess(true);
    } catch {
      toast.error('Não foi possível cadastrar o e-mail nesta sala.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto"
      >
        <Bell className="size-4" />
        Cadastrar e-mail
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-2xl border-[3px] border-[var(--ink)] bg-[var(--paper)] p-0 shadow-brutal-lg" showCloseButton={!isSubmitting}>
          {isSuccess ? (
            <div className="space-y-0">
              <div className="border-b-[3px] border-[var(--ink)] bg-[var(--accent)] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full border-[3px] border-[var(--ink)] bg-[var(--paper)]">
                    <CheckCircle2 className="size-6 text-[var(--ink)]" />
                  </div>
                  <div>
                    <h2 className="font-mono text-lg font-bold uppercase tracking-[0.08em] text-[var(--ink)]">
                      Inscrição confirmada
                    </h2>
                    <p className="mt-1 text-sm text-[var(--ink)]/80">
                      O endereço <strong>{submittedEmail}</strong> agora está vinculado à sala {salaNome}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-6 py-5 text-sm text-[var(--ink)]/80">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 text-[var(--ink)]" />
                  <p>
                    Novos assinantes recebem o e-mail de boas-vindas e os próximos lembretes seguem o cron do backend.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Bell className="mt-0.5 size-4 text-[var(--ink)]" />
                  <p>
                    Se este e-mail já existia, a sala atual substituiu as salas anteriores cadastradas para ele.
                  </p>
                </div>
              </div>

              <DialogFooter className="border-t-[3px] border-[var(--ink)] bg-[var(--paper)]/80 px-6 py-4">
                <Button type="button" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <DialogHeader className="border-b-[3px] border-[var(--ink)] bg-[var(--paper)] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full border-[3px] border-[var(--ink)] bg-[var(--accent)]">
                    <Bell className="size-5 text-[var(--ink)]" />
                  </div>
                  <div>
                    <DialogTitle className="font-mono text-lg font-bold uppercase tracking-[0.08em] text-[var(--ink)]">
                      Alertas por e-mail
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-[var(--ink)]/75">
                      Cadastre um endereço para receber avisos da sala <strong>{salaNome}</strong>.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 px-6 py-5">
                <div className="rounded-[6px] border-[3px] border-[var(--ink)] bg-[var(--accent)]/40 p-3 text-xs font-mono uppercase tracking-[0.08em] text-[var(--ink)]/80">
                  Se o e-mail já estiver cadastrado, esta sala substituirá as salas anteriores vinculadas a ele.
                </div>

                <div className="space-y-2">
                  <label htmlFor="email-sala" className="block text-xs font-mono font-bold uppercase tracking-[0.08em] text-[var(--ink)]">
                    E-mail
                  </label>
                  <Input
                    id="email-sala"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@exemplo.com"
                    required
                    disabled={isSubmitting}
                    className="h-11 border-[3px] border-[var(--ink)] bg-white text-sm"
                  />
                </div>
              </div>

              <DialogFooter className="border-t-[3px] border-[var(--ink)] bg-[var(--paper)]/80 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Salvando
                    </>
                  ) : (
                    <>
                      <Mail className="size-4" />
                      Confirmar e-mail
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
