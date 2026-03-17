import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { adminStorage } from '@/lib/adminApi';

export function AdminLayout() {
  const navigate = useNavigate();
  const { salaId } = useParams<{ salaId: string }>();
  const [session, setSession] = useState(adminStorage.getSession());

  useEffect(() => {
    if (!session || !adminStorage.isAuthenticated()) {
      navigate('/admin');
    } else if (salaId && session.salaId.toString() !== salaId) {
      navigate(`/admin/${session.salaId}`);
    }
  }, [session, salaId, navigate]);

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar
        salaId={session.salaId.toString()}
        nomeSala={session.nomeSala}
        semestre={session.semestre}
      />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
