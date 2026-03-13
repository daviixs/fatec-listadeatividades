import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { Layout } from '@/components/layout/Layout';

// Pages
import { Home } from '@/pages/Home';
import { Periodo } from '@/pages/Periodo';
import { Semestre } from '@/pages/Semestre';
import { Materias } from '@/pages/Materias';
import { Atividades } from '@/pages/Atividades';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:courseId/periodo" element={<Periodo />} />
          <Route path="/:courseId/:periodId/semestres" element={<Semestre />} />
          <Route path="/:courseId/:periodId/:semesterId/materias" element={<Materias />} />
          <Route path="/:courseId/:periodId/:semesterId/:subjectId/atividades" element={<Atividades />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
