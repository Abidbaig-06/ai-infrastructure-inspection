import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { ArrowRight, AlertTriangle } from 'lucide-react';

export const ComplaintButton = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(ROUTES.COMPLAINT_APP_URL);
  };

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className="white-gloss-btn px-8 py-4 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-3 group focus:outline-none transition-all cursor-pointer relative overflow-hidden shadow-2xl"
      aria-label="Report a public infrastructure issue"
    >
      <span className="w-7 h-7 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
        ▶
      </span>
      <span className="tracking-wider">
        REPORT A PUBLIC INFRASTRUCTURE ISSUE
      </span>
      <ArrowRight className="w-4 h-4 text-zinc-900 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};
