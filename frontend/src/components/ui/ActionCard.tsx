import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ActionCardProps {
  children?: ReactNode;
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  delay?: number;
  badge?: string;
}

export function ActionCard({ children, title, icon, onClick, className = '', delay = 0, badge }: ActionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={!onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      whileHover={onClick ? { y: -2 } : {}}
      whileTap={onClick ? { y: 0 } : {}}
      className={`relative w-full overflow-hidden rounded-[6px] bg-paper border-[3px] border-ink p-4 sm:p-5 md:p-6 text-left transition-all duration-200 min-h-[140px] sm:min-h-[160px] flex flex-col gap-3 shadow-brutal ${
        onClick ? 'cursor-pointer hover:shadow-brutal-lg' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          {badge && (
            <span className="badge-brutal" data-variant="accent">
              {badge}
            </span>
          )}
          <h3 className="font-extrabold text-lg sm:text-xl leading-tight">{title}</h3>
        </div>

        {icon && (
          <div className="bg-ink text-paper w-12 h-12 sm:w-14 sm:h-14 rounded-[6px] border-[3px] border-ink flex items-center justify-center shadow-brutal">
            {icon}
          </div>
        )}
      </div>

      {children && <div className="text-xs sm:text-sm text-ink/80 font-mono leading-snug">{children}</div>}
    </motion.button>
  );
}
