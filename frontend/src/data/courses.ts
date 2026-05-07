import { schedules, type Turno as ScheduleTurno, type Slot } from './schedules';

export type Activity = {
  id: string;
  title: string;
  deadline: string;
  status: 'pending' | 'completed' | 'late';
};

export type Subject = {
  id: string;
  name: string;
  activities?: Activity[];
};

export type Semester = {
  id: string;
  name: string;
  subjects: Subject[];
};

export type PeriodId = 'diurno' | 'noturno';
export type TurnoId = ScheduleTurno['id'];

export type CourseTurno = {
  id: TurnoId;
  periodId: PeriodId;
  name: string;
  semesters: Semester[];
};

export type Course = {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  icon?: string;
  turnos: CourseTurno[];
  semesters: Semester[];
};

const courseMetadata: Record<string, Pick<Course, 'name' | 'fullName' | 'description'>> = {
  ads: {
    name: 'ADS',
    fullName: 'Análise e Desenvolvimento de Sistemas',
    description: 'Criação e organização de sistemas e programas.',
  },
  dsm: {
    name: 'DSM',
    fullName: 'Desenvolvimento de Software Multiplataforma',
    description: 'Criação de aplicativos para web, celular e outros dispositivos.',
  },
  gpi: {
    name: 'GPI',
    fullName: 'Gestão da Produção Industrial',
    description: 'Organização e melhoria de processos industriais.',
  },
  grh: {
    name: 'GRH',
    fullName: 'Gestão de Recursos Humanos',
    description: 'Cuidado com pessoas, equipes e desenvolvimento profissional.',
  },
};

const courseOrder = ['ads', 'dsm', 'gpi', 'grh'];

const periodByTurno: Record<TurnoId, PeriodId> = {
  matutino: 'diurno',
  noturno: 'noturno',
};

const turnoByPeriod: Record<PeriodId, TurnoId> = {
  diurno: 'matutino',
  noturno: 'noturno',
};

function toSubjectId(name: string, index: number): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${String(index + 1).padStart(2, '0')}-${slug || 'materia'}`;
}

function toSubjects(slots: Slot[]): Subject[] {
  const names = Array.from(new Set(slots.map((slot) => slot.disciplina)));
  return names.map((name, index) => ({
    id: toSubjectId(name, index),
    name,
  }));
}

export const courses: Course[] = schedules
  .slice()
  .sort((a, b) => courseOrder.indexOf(a.id) - courseOrder.indexOf(b.id))
  .map((schedule) => {
    const metadata = courseMetadata[schedule.id] || {
      name: schedule.id.toUpperCase(),
      fullName: schedule.name,
      description: undefined,
    };

    const turnos = schedule.turnos.map((turno) => ({
      id: turno.id,
      periodId: periodByTurno[turno.id],
      name: turno.name,
      semesters: turno.semesters.map((semester) => ({
        id: semester.id,
        name: semester.name,
        subjects: toSubjects(semester.slots),
      })),
    }));

    return {
      id: schedule.id,
      ...metadata,
      turnos,
      semesters: turnos[0]?.semesters ?? [],
    };
  });

export const getCourseById = (id: string) => courses.find((course) => course.id === id);

export const getTurnoByPeriod = (courseId: string, periodId: string | undefined) => {
  const course = getCourseById(courseId);
  const turnoId = periodId === 'diurno' || periodId === 'noturno' ? turnoByPeriod[periodId] : undefined;
  return course?.turnos.find((turno) => turno.id === turnoId);
};

export const getSemestersByPeriod = (courseId: string, periodId: string | undefined) => {
  const course = getCourseById(courseId);
  const turno = getTurnoByPeriod(courseId, periodId);
  return turno?.semesters ?? course?.semesters ?? [];
};

export const getSemesterById = (courseId: string, semesterId: string, periodId?: string) => {
  const semesters = periodId ? getSemestersByPeriod(courseId, periodId) : getCourseById(courseId)?.semesters;
  return semesters?.find((semester) => semester.id === semesterId);
};

export const getSubjectById = (courseId: string, semesterId: string, subjectId: string, periodId?: string) => {
  const semester = getSemesterById(courseId, semesterId, periodId);
  return semester?.subjects.find((subject) => subject.id === subjectId);
};
