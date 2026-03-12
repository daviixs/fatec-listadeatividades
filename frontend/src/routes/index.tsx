import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppDispatch';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import PublicLayout from '@/layouts/PublicLayout';

// Components
import PageTransition from '@/components/PageTransition';

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
          <Route path="/" element={
            <PageTransition>
              <CursosPage />
            </PageTransition>
          } />
          <Route path="/cursos/:cursoNome" element={
            <PageTransition>
              <CursoDetalhesPage />
            </PageTransition>
          } />
          <Route path="/cursos/:cursoNome/:turno" element={
            <PageTransition>
              <TurnoDetalhesPage />
            </PageTransition>
          } />
          <Route path="/cursos/:cursoNome/:turno/:semestre" element={
            <PageTransition>
              <SemestreDetalhesPage />
            </PageTransition>
          } />
          <Route path="/cursos/:cursoNome/:turno/:semestre/materias/:materiaId" element={
            <PageTransition>
              <MateriaAtividadesPage />
            </PageTransition>
          } />
          <Route path="/materias/:materiaId/atividades" element={
            <PageTransition>
              <AtividadesLista />
            </PageTransition>
          } />
          <Route path="/atividades/:id" element={
            <PageTransition>
              <AtividadeDetalhes />
            </PageTransition>
          } />
          <Route path="/login" element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          } />
          <Route path="/aguardando" element={
            <PageTransition>
              <AguardandoAprovacao />
            </PageTransition>
          } />
        </Route>

        {/* Rotas do Aluno */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/aluno" element={
            <PageTransition>
              <AlunoDashboard />
            </PageTransition>
          } />
          <Route path="/aluno/atividades" element={
            <PageTransition>
              <AtividadesLista />
            </PageTransition>
          } />
          <Route path="/aluno/votacoes" element={
            <PageTransition>
              <VotacoesLista />
            </PageTransition>
          } />
          <Route path="/atividades/:id" element={
            <PageTransition>
              <AtividadeDetalhes />
            </PageTransition>
          } />
          <Route
              path="/atividades/:atividadeId/votar"
              element={
                <PageTransition>
                  <VotacaoPage />
                </PageTransition>
              }
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
          <Route path="/lider" element={
            <PageTransition>
              <LiderDashboard />
            </PageTransition>
          } />
          <Route path="/lider/alunos" element={
            <PageTransition>
              <GerenciarAlunos />
            </PageTransition>
          } />
          <Route path="/lider/entradas" element={
            <PageTransition>
              <AprovarEntradas />
            </PageTransition>
          } />
          <Route path="/lider/atividades" element={
            <PageTransition>
              <GerenciarAtividades />
            </PageTransition>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
