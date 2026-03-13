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
      className="cursor-pointer card-hover rounded-xl border-0 bg-white"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-[#5A7C7A] to-[#6B9B7A] text-white p-4 rounded-xl shadow-lg">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{nome}</h3>
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