import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock } from 'lucide-react';

interface CursoCardProps {
  nome: string;
  semestre: string;
  onClick: () => void;
}

export default function CursoCard({ nome, semestre, onClick }: CursoCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{nome}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{semestre} semestre</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}