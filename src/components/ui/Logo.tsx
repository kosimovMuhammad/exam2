import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

export function Logo({ className = '', collapsed = false }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-3 group transition-all outline-none ${className}`}>
      {/* Icon */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.5)] overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_25px_-4px_rgba(59,130,246,0.6)]">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_infinite]" />
        
        {/* Abstract Logo Shape */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-5 h-5 text-white relative z-10 drop-shadow-md" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      
      {/* Text Name */}
      {!collapsed && (
        <div className="flex flex-col animate-in fade-in zoom-in duration-300">
          <span className="font-black text-[22px] tracking-tight text-slate-900 dark:text-white leading-none">
            Debt<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Tracker</span>
          </span>
          <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 tracking-[0.25em] uppercase mt-1 opacity-80">
            Professional
          </span>
        </div>
      )}
    </Link>
  );
}
