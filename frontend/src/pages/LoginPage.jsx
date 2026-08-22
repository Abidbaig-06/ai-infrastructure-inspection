import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ROUTES } from '../config/routes';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, Building2, CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react';

export const LoginPage = () => {
  const { login, quickDemoLogin, demoOfficers, loading, error } = useAuth();
  const [email, setEmail] = useState('engineer@civic.gov');
  const [password, setPassword] = useState('demo');
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await login({ email, password });
      navigate(ROUTES.INSPECTOR_WORKSPACE);
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  const handleDemoClick = async (officer) => {
    setAuthError(null);
    try {
      await quickDemoLogin(officer);
      navigate(ROUTES.INSPECTOR_WORKSPACE);
    } catch (err) {
      setAuthError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-rock text-zinc-100 flex flex-col justify-between relative overflow-hidden">
      <Header />

      {/* Main Login Card Area */}
      <div className="max-w-md w-full mx-auto p-4 my-auto">
        <div className="charcoal-glass rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 relative overflow-hidden text-zinc-100">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-6 h-6 drop-shadow-[0_0_6px_#ffffff]" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white">
              Authorized Inspector Sign In
            </h2>
            <p className="text-xs text-zinc-400">
              Restricted municipal access for AI triage, risk verification, and field maintenance dispatch.
            </p>
          </div>

          {/* 1-Click Quick Demo Profiles */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              1-Click Demo Profiles (Instant Evaluation):
            </span>

            <div className="space-y-2">
              {(demoOfficers.length > 0 ? demoOfficers : [
                {
                  id: '1',
                  name: 'Dr. Aris Thorne',
                  email: 'engineer@civic.gov',
                  role: 'SENIOR_ENGINEER',
                  department: 'Chief Municipal Engineer'
                },
                {
                  id: '2',
                  name: 'Sarah Jenkins',
                  email: 'triage@civic.gov',
                  role: 'DISPATCH_OFFICER',
                  department: 'Emergency AI Dispatcher'
                },
                {
                  id: '3',
                  name: 'Marcus Vance',
                  email: 'field@civic.gov',
                  role: 'FIELD_SUPERVISOR',
                  department: 'Field Works Supervisor'
                }
              ]).map((officer) => (
                <button
                  key={officer.email}
                  type="button"
                  onClick={() => handleDemoClick(officer)}
                  disabled={loading}
                  className="w-full p-3 rounded-2xl charcoal-glass-card border border-white/15 hover:border-white/40 text-left flex items-center justify-between group transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 group-hover:bg-white group-hover:text-black flex items-center justify-center text-xs font-bold text-white transition-colors">
                      {officer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-zinc-200">
                        {officer.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {officer.department || officer.role}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] font-mono uppercase font-bold text-zinc-400">
              <span className="bg-[#09090b] px-3">or enter officer badge credentials</span>
            </div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleManualLogin} className="space-y-3.5 text-xs">
            {authError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-zinc-300 font-semibold mb-1 font-mono">
                Official Municipal Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="charcoal-glass-input w-full pl-9 pr-3 py-2.5 rounded-xl text-white focus:outline-none"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1 font-mono">
                Security Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="charcoal-glass-input w-full pl-9 pr-3 py-2.5 rounded-xl text-white focus:outline-none"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="white-gloss-btn w-full py-3.5 px-4 rounded-xl font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-black" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Command Center'}</span>
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};
