import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppDispatch';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import PublicLayout from '@/layouts/PublicLayout';

// Auth pages
import AguardandoAprovacao from '@/features/auth/components/AguardandoAprovacao';
import LoginPage from '@/features/auth/components/LoginPage';

// Public pages
import CursosPage from '@/features/cursos/components/CursosPage';
import CursoDetalhesPage from '@/features/cursos/components/CursoDetalhesPage';
import TurnoDetalhesPage from '@/features/cursos/components/TurnoDetalhesPage';
import SemestreDetalhesPage from '@/features/cursos/components/SemestreDetalhesPage';
import MateriaAtividadesPage from '@/features/cursos/components/MateriaAtividadesPage';

// Aluno pages
import AlunoDashboard from '@/features/aluno/components/AlunoDashboard';
import AtividadesLista from '@/features/aluno/components/AtividadesLista';
import VotacoesLista from '@/features/aluno/components/VotacoesLista';

// Atividade pages
import AtividadeDetalhes from '@/features/atividade/components/AtividadeDetalhes';
import VotacaoPage from '@/features/atividade/components/VotacaoPage';

// Líder pages
import LiderDashboard from '@/features/lider/components/LiderDashboard';
import GerenciarAlunos from '@/features/lider/components/GerenciarAlunos';
import AprovarEntradas from '@/features/lider/components/AprovarEntradas';
import GerenciarAtividades from '@/features/lider/components/GerenciarAtividades';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { aluno, salaId } = useAppSelector((s) => s.auth);
  if (!aluno || !salaId) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function LiderRoute({ children }: { children: React.ReactNode }) {
  const { isLider } = useAppSelector((s) => s.auth);
  if (!isLider) {
    return <Navigate to="/aluno" replace />;
  }
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<CursosPage />} />
          <Route path="/cursos/:cursoNome" element={<CursoDetalhesPage />} />
          <Route path="/cursos/:cursoNome/:turno" element={<TurnoDetalhesPage />} />
          <Route path="/cursos/:cursoNome/:turno/:semestre" element={<SemestreDetalhesPage />} />
          <Route path="/cursos/:cursoNome/:turno/:semestre/materias/:materiaId" element={<MateriaAtividadesPage />} />
          <Route path="/materias/:materiaId/atividades" element={<AtividadesLista />} />
          <Route path="/atividades/:id" element={<AtividadeDetalhes />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/aguardando" element={<AguardandoAprovacao />} />
        </Route>

        {/* Rotas do Aluno */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/aluno" element={<AlunoDashboard />} />
          <Route path="/aluno/atividades" element={<AtividadesLista />} />
          <Route path="/aluno/votacoes" element={<VotacoesLista />} />
          <Route path="/atividades/:id" element={<AtividadeDetalhes />} />
          <Route
              path="/atividades/:atividadeId/votar"
              element={<VotacaoPage />}
          />
        </Route>

        {/* Rotas do Líder */}
        <Route
          element={
            <ProtectedRoute>
              <LiderRoute>
                <MainLayout />
              </LiderRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/lider" element={<LiderDashboard />} />
          <Route path="/lider/alunos" element={<GerenciarAlunos />} />
          <Route path="/lider/entradas" element={<AprovarEntradas />} />
          <Route path="/lider/atividades" element={<GerenciarAtividades />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
