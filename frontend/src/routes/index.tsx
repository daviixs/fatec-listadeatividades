import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { Layout } from '@/components/layout/Layout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Pages
import { Home } from '@/pages/Home';
import { Periodo } from '@/pages/Periodo';
import { Semestre } from '@/pages/Semestre';
import { CalendarioSemestre } from '@/pages/CalendarioSemestre';

// Admin Pages
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminAtividades } from '@/pages/admin/AdminAtividades';
import { AdminProvas } from '@/pages/admin/AdminProvas';

// Master Admin Pages
import { MasterAdminLogin } from '@/pages/master/MasterAdminLogin';
import { MasterAdminDashboard } from '@/pages/master/MasterAdminDashboard';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:courseId/periodo" element={<Periodo />} />
          <Route path="/:courseId/:periodId/semestres" element={<Semestre />} />
          <Route path="/:courseId/:periodId/:semesterId" element={<CalendarioSemestre />} />
          <Route
            path="/:courseId/:periodId/:semesterId/materias"
            element={<Navigate to={`/:courseId/:periodId/:semesterId`} replace />}
          />
          <Route
            path="/:courseId/:periodId/:semesterId/:subjectId/atividades"
            element={<Navigate to={`/:courseId/:periodId/:semesterId`} replace />}
          />
        </Route>

        {/* Rotas Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/:salaId" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="atividades" element={<AdminAtividades />} />
          <Route path="provas" element={<AdminProvas />} />
        </Route>

        {/* Rotas Master Admin */}
        <Route path="/master-admin/login" element={<MasterAdminLogin />} />
        <Route path="/master-admin/dashboard" element={<MasterAdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
