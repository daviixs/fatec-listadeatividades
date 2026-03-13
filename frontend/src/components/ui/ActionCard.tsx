import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ActionCardProps {
  children?: ReactNode;
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  delay?: number;
}

export function ActionCard({ children, title, icon, onClick, className = '', delay = 0 }: ActionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={!onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`relative w-full overflow-hidden rounded-2xl bg-white border-2 border-slate-200/60 p-6 pb-24 text-left transition-all duration-300 min-h-[140px] flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      } ${className}`}
    >
      <h3 className="font-black text-indigo-900 text-lg relative z-10">{title}</h3>
      
      {children && <div className="mt-2 text-sm text-slate-500 font-bold relative z-10">{children}</div>}

      {/* Cloud & Icon decorator in the bottom right corner */}
      {icon && (
        <div className="absolute right-0 bottom-0 pointer-events-none translate-x-2 translate-y-2">
          {/* Faint cloud shape */}
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-50/80 rounded-full blur-[2px] -translate-x-4 -translate-y-4" />
          <div className="absolute right-0 bottom-0 w-16 h-16 bg-indigo-100/60 rounded-full blur-[2px] -translate-x-12 translate-y-2" />
          <div className="absolute right-0 bottom-0 w-20 h-20 bg-indigo-50 rounded-full blur-[1px] translate-x-4 -translate-y-12" />
          
          <div className="relative z-10 right-4 bottom-4 w-12 h-12 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
    </motion.button>
  );
}
