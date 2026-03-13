import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, ExternalLink, FileText } from 'lucide-react';
import type { Atividade } from '@/types';

export default function MateriaAtividadesPage() {
  const { cursoNome, turno, semestre, materiaId } = useParams<{ 
    cursoNome: string; 
    turno: string; 
    semestre: string; 
    materiaId: string 
  }>();

  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (materiaId) {
      fetchAtividadesPorMateria(Number(materiaId));
    }
  }, [materiaId]);

  const fetchAtividadesPorMateria = async (id: number) => {
    setLoading(true);
    try {
      const response = await api.get<Atividade[]>(`/materias/${id}/atividades`);
      setAtividades(response.data);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const turnoFormatado = turno === 'manha' ? 'Manhã' : 'Noite';
  const semestreFormatado = `${semestre}° Semestre`;

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ATIVA') {
      return <Badge className="bg-green-500">Ativa</Badge>;
    } else if (status === 'CANCELADA') {
      return <Badge className="bg-red-500">Cancelada</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to={`/cursos/${cursoNome}/${turno}/${semestre}`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar para {cursoNome?.toUpperCase()} - {semestreFormatado}
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex-1">
          Atividades da Matéria
        </h1>
      </div>

      {atividades.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-600">Nenhuma atividade cadastrada nesta matéria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {atividades.map((atividade) => (
            <Card key={atividade.id} className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{atividade.titulo}</CardTitle>
                      {getStatusBadge(atividade.status)}
                    </div>
                    {atividade.materiaNome && (
                      <p className="text-sm text-gray-600 mb-2">
                        Matéria: {atividade.materiaNome}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{atividade.descricao}</p>
                
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Prazo: {formatarData(atividade.prazo)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      Tipo: {atividade.tipoEntrega === 'LINK_EXTERNO' ? 'Link Externo' : 'Entrega Manual'}
                    </span>
                  </div>
                </div>

                {atividade.tipoEntrega === 'LINK_EXTERNO' && atividade.linkEntrega && (
                  <a
                    href={atividade.linkEntrega}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Acessar link de entrega
                  </a>
                )}

                {atividade.regrasEntrega && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Regras de entrega:</p>
                    <p className="text-sm text-gray-600">{atividade.regrasEntrega}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
