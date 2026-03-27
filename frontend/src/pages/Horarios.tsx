import { useMemo, useState } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { schedules, type CourseSchedule, type Turno, type Semester, type Slot } from '@/data/schedules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function findDefaults() {
  const firstCourse = schedules[0];
  const firstTurno = firstCourse.turnos[0];
  const firstSemester = firstTurno.semesters[0];
  return {
    courseId: firstCourse.id,
    turnoId: firstTurno.id,
    semesterId: firstSemester.id,
  };
}

export function Horarios() {
  const defaults = useMemo(findDefaults, []);
  const [courseId, setCourseId] = useState(defaults.courseId);
  const [turnoId, setTurnoId] = useState<'matutino' | 'noturno'>(defaults.turnoId as any);
  const [semesterId, setSemesterId] = useState(defaults.semesterId);
  const [searchTerm, setSearchTerm] = useState('');

  const course = schedules.find((c) => c.id === courseId) as CourseSchedule;
  const turno = course.turnos.find((t) => t.id === turnoId) as Turno;
  const semester = turno.semesters.find((s) => s.id === semesterId) as Semester;

  const filteredSlots = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return semester.slots.filter((slot: Slot) => {
      if (!term) return true;
      return (
        slot.disciplina.toLowerCase().includes(term) ||
        slot.dia.toLowerCase().includes(term) ||
        slot.inicio.includes(term) ||
        slot.fim.includes(term)
      );
    });
  }, [semester, searchTerm]);

  const handleCourseChange = (value: string | null) => {
    if (!value) return;
    const newCourse = schedules.find((c) => c.id === value)!;
    const newTurno = newCourse.turnos[0];
    const newSemester = newTurno.semesters[0];
    setCourseId(value);
    setTurnoId(newTurno.id);
    setSemesterId(newSemester.id);
    setSearchTerm('');
  };

  const handleTurnoChange = (value: 'matutino' | 'noturno' | null) => {
    if (!value) return;
    const newTurno = course.turnos.find((t) => t.id === value)!;
    const newSemester = newTurno.semesters[0];
    setTurnoId(newTurno.id);
    setSemesterId(newSemester.id);
    setSearchTerm('');
  };

  const handleSemesterChange = (value: string | null) => {
    if (value) {
      setSemesterId(value);
      setSearchTerm('');
    }
  };

  const handleClear = () => setSearchTerm('');

  return (
    <PageTransition>
      <div className="space-y-6">
        <header className="bg-ink text-paper border-[3px] border-ink shadow-brutal rounded-[6px] p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.08em]">Horários de Aula / 2026</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                {course.name} — {turno.name}
              </h1>
            </div>
            <Badge variant="secondary">Linhas: {filteredSlots.length}</Badge>
          </div>
        </header>

        <section className="brutal-block p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-[0.08em]">Curso</p>
              <Select value={courseId} onValueChange={handleCourseChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schedules.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-[0.08em]">Turno</p>
              <Select value={turnoId} onValueChange={handleTurnoChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {course.turnos.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-[0.08em]">Semestre/Período</p>
              <Select value={semesterId} onValueChange={handleSemesterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {turno.semesters.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-[0.08em]">Buscar (disciplina/dia)</p>
              <Input
                placeholder="Filtrar por nome ou dia"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleClear}>
              Limpar busca
            </Button>
          </div>
        </section>

        <section className="overflow-x-auto brutal-block p-0">
          <table className="w-full border-collapse">
            <thead className="bg-ink text-paper">
              <tr>
                {['Dia', 'Início', 'Fim', 'Disciplina'].map((col) => (
                  <th
                    key={col}
                    className="text-left px-3 sm:px-4 py-3 text-xs sm:text-sm font-mono uppercase tracking-[0.08em] border-b-[3px] border-ink"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSlots.map((slot, idx) => (
                <tr
                  key={`${slot.dia}-${slot.inicio}-${idx}`}
                  className="border-b-[3px] border-ink last:border-b-0 hover:bg-accent/60 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-3 text-sm font-mono">{slot.dia}</td>
                  <td className="px-3 sm:px-4 py-3 text-sm font-mono">{slot.inicio}</td>
                  <td className="px-3 sm:px-4 py-3 text-sm font-mono">{slot.fim}</td>
                  <td className="px-3 sm:px-4 py-3 text-sm font-mono">{slot.disciplina}</td>
                </tr>
              ))}
              {filteredSlots.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm font-mono text-ink/70">
                    Nenhum horário encontrado para esse filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </PageTransition>
  );
}
