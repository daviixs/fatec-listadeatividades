import { useAppSelector } from '@/hooks/useAppDispatch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, ClipboardList, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LiderDashboard() {
  const { salaNome, salaCodigo } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Gerenciar Alunos',
      description: 'Cadastrar, listar e excluir alunos da sala',
      icon: <Users className="h-8 w-8 text-blue-500" />,
      to: '/lider/alunos',
    },
    {
      title: 'Aprovar Entradas',
      description: 'Aprovar ou rejeitar solicitações de entrada',
      icon: <UserCheck className="h-8 w-8 text-emerald-500" />,
      to: '/lider/entradas',
    },
    {
      title: 'Gerenciar Atividades',
      description: 'Criar, editar e gerenciar atividades e votações',
      icon: <ClipboardList className="h-8 w-8 text-amber-500" />,
      to: '/lider/atividades',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Informações da sala */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <CardTitle>Painel do Líder</CardTitle>
          </div>
          <CardDescription>
            Gerencie a sala e seus recursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Nome da Sala</p>
              <p className="font-medium">{salaNome}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Código de Convite</p>
              <Badge variant="outline" className="font-mono text-base">
                {salaCodigo}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu rápido */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card
            key={item.to}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(item.to)}
          >
            <CardContent className="flex items-center gap-4 pt-6">
              {item.icon}
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
