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
      className={`relative w-full overflow-hidden rounded-2xl bg-white border-2 border-slate-200/60 p-4 sm:p-5 md:p-6 pb-20 sm:pb-24 text-left transition-all duration-300 min-h-[120px] sm:min-h-[140px] flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      } ${className}`}
    >
      <h3 className="font-black text-slate-900 text-base sm:text-lg relative z-10">{title}</h3>

      {children && <div className="mt-2 text-xs sm:text-sm text-slate-500 font-bold relative z-10">{children}</div>}

      {/* Cloud & Icon decorator in bottom right corner */}
      {icon && (
        <div className="absolute right-0 bottom-0 pointer-events-none translate-x-1.5 sm:translate-x-2 translate-y-1.5 sm:translate-y-2">
          {/* Faint cloud shape */}
          <div className="absolute right-0 bottom-0 w-16 sm:w-20 h-16 sm:h-20 bg-slate-50/80 rounded-full blur-[2px] -translate-x-3 sm:-translate-x-4 -translate-y-3 sm:-translate-y-4" />
          <div className="absolute right-0 bottom-0 w-12 sm:w-16 h-12 sm:h-16 bg-slate-100/60 rounded-full blur-[2px] -translate-x-9 sm:-translate-x-12 translate-y-1.5 sm:translate-y-2" />
          <div className="absolute right-0 bottom-0 w-14 sm:w-20 h-14 sm:h-20 bg-slate-50 rounded-full blur-[1px] translate-x-3 sm:translate-x-4 -translate-y-9 sm:-translate-y-12" />

          <div className="relative z-10 right-3 sm:right-4 bottom-3 sm:bottom-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
    </motion.button>
  );
}
