/**
 * Utilitários para manipulação de datas do calendário
 */

/**
 * Obtém o número de dias em um mês específico
 */
export function getDaysInMonth(year: number, month: number): number[] {
  const date = new Date(year, month, 1);
  const days: number[] = [];
  
  while (date.getMonth() === month) {
    days.push(date.getDate());
    date.setDate(date.getDate() + 1);
  }
  
  return days;
}

/**
 * Obtém o dia da semana do primeiro dia do mês (0 = domingo, 6 = sábado)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Verifica se duas datas são o mesmo dia (ignorando hora)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Formata mês e ano em português
 */
export function formatMonthYear(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    year: 'numeric',
  };
  
  return date.toLocaleDateString('pt-BR', options);
}

/**
 * Obtém o primeiro dia da semana da data (domingo)
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

/**
 * Obtém o último dia da semana da data (sábado)
 */
export function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

/**
 * Verifica se a data é hoje
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

/**
 * Obtém todas as semanas de um mês para renderização em grid
 * Retorna uma matriz de 6 semanas x 7 dias
 */
export function getWeeksOfMonth(year: number, month: number): (Date | null)[][] {
  const weeks: (Date | null)[][] = [];
  
  // Primeiro dia do mês
  const firstDay = new Date(year, month, 1);
  // Dia da semana do primeiro dia (0 = domingo)
  const firstDayOfWeek = firstDay.getDay();
  
  // Último dia do mês
  const lastDay = new Date(year, month + 1, 0);
  // Total de dias no mês
  const daysInMonth = lastDay.getDate();
  
  // Dias do mês anterior para completar a primeira semana
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays: Date[] = [];
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    prevMonthDays.push(new Date(year, month - 1, day));
  }
  
  // Dias do mês atual
  const currentMonthDays: Date[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(new Date(year, month, i));
  }
  
  // Dias do próximo mês para completar a última semana
  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysNeeded = (Math.ceil(totalCells / 7) * 7) - totalCells;
  const nextMonthDays: Date[] = [];
  
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    nextMonthDays.push(new Date(year, month + 1, i));
  }
  
  // Combinar todos os dias
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  
  // Dividir em semanas de 7 dias
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }
  
  return weeks;
}

/**
 * Navega para o mês anterior
 */
export function getPreviousMonth(date: Date): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
}

/**
 * Navega para o próximo mês
 */
export function getNextMonth(date: Date): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}

/**
 * Verifica se a data pertence ao mês atual
 */
export function isCurrentMonth(date: Date, currentMonth: Date): boolean {
  return (
    date.getMonth() === currentMonth.getMonth() &&
    date.getFullYear() === currentMonth.getFullYear()
  );
}

/**
 * Obtém o nome do mês em português
 */
export function getMonthName(month: number): string {
  const date = new Date(2000, month, 1);
  return date.toLocaleDateString('pt-BR', { month: 'long' });
}

/**
 * Obtém o nome do dia da semana em português (abreviado)
 */
export function getDayName(dayOfWeek: number): string {
  const names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return names[dayOfWeek];
}

/**
 * Formata data no formato DD/MM/YYYY
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formata data no formato "15 de Março de 2026"
 */
export function formatDateFull(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
