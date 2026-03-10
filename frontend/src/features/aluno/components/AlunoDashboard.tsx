import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchMaterias } from '@/features/aluno/materiasSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, User } from 'lucide-react';

export default function AlunoDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { salaId } = useAppSelector((s) => s.auth);
  const { lista: materias, loading } = useAppSelector((s) => s.materias);

  useEffect(() => {
    if (salaId) {
      dispatch(fetchMaterias(salaId));
    }
  }, [dispatch, salaId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Matérias</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Matérias</h2>

      {materias.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p>Nenhuma matéria cadastrada nesta sala.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materias.map((materia) => (
            <Card
              key={materia.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/aluno/atividades?materiaId=${materia.id}`)}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">{materia.nome}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {materia.professor}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
