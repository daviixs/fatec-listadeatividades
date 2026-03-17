import type { SalaApiResponse } from '@/lib/studentApi';

export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function resolveCandidateSalasFromRoute(
  salas: SalaApiResponse[],
  courseId: string,
  periodId: string,
  semesterId: string
): SalaApiResponse[] {
  const targetCourse = normalizeText(courseId);
  const periodKeywords =
    periodId === 'diurno'
      ? ['manha', 'diurno', 'matutino']
      : ['noite', 'noturno', 'vespertino'];
  const semesterRegex = new RegExp(`\\b${escapeRegex(semesterId)}\\b`);

  return salas
    .filter((sala) => {
      const salaName = normalizeText(sala.nome);
      const startsWithCourse = salaName.startsWith(targetCourse);
      const hasPeriod = periodKeywords.some((keyword) => salaName.includes(keyword));
      const hasSemester = semesterRegex.test(salaName);
      return startsWithCourse && hasPeriod && hasSemester;
    })
    .sort((a, b) => b.id - a.id);
}

export function resolveSalaFromRoute(
  salas: SalaApiResponse[],
  courseId: string,
  periodId: string,
  semesterId: string
): SalaApiResponse | null {
  const [resolvedSala] = resolveCandidateSalasFromRoute(salas, courseId, periodId, semesterId);
  return resolvedSala || null;
}
