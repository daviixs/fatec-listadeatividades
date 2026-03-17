import { useAppSelector } from '@/hooks/useAppDispatch';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loading, error } = useAppSelector((s) => s.auth);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Fazer Login</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Faça login para acessar todas as funcionalidades.
          </p>

          <div className="space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <a
              href="/login"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              onClick={onClose}
            >
              {loading ? 'Carregando...' : 'Ir para página de login'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}