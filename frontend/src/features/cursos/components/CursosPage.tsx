import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCursos } from '@/features/cursos/cursosSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users } from 'lucide-react';

export default function CursosPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { lista: cursos, loading } = useAppSelector((s) => s.cursos);

  useEffect(() => {
    dispatch(fetchCursos());
  }, [dispatch]);

  const cursoInfo = {
    ADS: {
      nome: 'Análise e Desenvolvimento de Sistemas',
      descricao: 'Desenvolvimento de aplicações web, móveis e desktop',
      color: 'bg-blue-500'
    },
    DSM: {
      nome: 'Desenvolvimento de Software Multiplataforma',
      descricao: 'Criação de apps para iOS, Android e Web',
      color: 'bg-purple-500'
    },
    GPI: {
      nome: 'Gestão da Produção Industrial',
      descricao: 'Planejamento e controle de processos industriais',
      color: 'bg-orange-500'
    },
    GRH: {
      nome: 'Gestão de Recursos Humanos',
      descricao: 'Administração de pessoas e talentos',
      color: 'bg-green-500'
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Cursos</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-40 bg-gray-200 rounded-t-lg"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Bem-vindo ao TodoList FATEC</h1>
        <p className="text-lg text-gray-600">Escolha um curso para ver as atividades</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cursos.map((curso) => {
          const info = cursoInfo[curso.nome as keyof typeof cursoInfo];
          return (
            <Card
              key={curso.nome}
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={() => navigate(`/cursos/${curso.nome.toLowerCase()}`)}
            >
              <CardHeader className="pb-4">
                <div className={`h-40 ${info?.color || 'bg-gray-500'} rounded-t-lg flex items-center justify-center mb-4`}>
                  <GraduationCap className="h-16 w-16 text-white" />
                </div>
                <CardTitle className="text-2xl">{curso.nome}</CardTitle>
                <CardDescription className="text-base">{info?.nome}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{info?.descricao}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{curso.semestres.length} semestres disponíveis</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}