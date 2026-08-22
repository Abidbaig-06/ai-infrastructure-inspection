import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/routes';
import { Lock, Shield, AlertCircle, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';

export const InspectorLogin = () => {
  const { login, demoOfficers, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Work Email, Phone, or Username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your access password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: identifier.trim(), password });
      navigate(ROUTES.INSPECTOR_WORKSPACE);
    } catch (err) {
      setErrorMessage('Invalid credentials or unauthorized personnel identifier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSelect = (officer) => {
    setIdentifier(officer.email);
    setPassword('demo');
    setErrorMessage('');
  };

  return (
    <div
      id="inspector-auth-panel"
      className="charcoal-glass rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden text-zinc-100 transition-all duration-300"
      aria-labelledby="inspector-panel-title"
    >
      {/* Specular White Light Top Rim Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-1.5 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2
            id="inspector-panel-title"
            className="text-xs font-mono font-bold tracking-widest text-zinc-200 uppercase flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            AUTHORIZED INSPECTOR ACCESS
          </h2>
          <span className="obsidian-pill-glass px-3 py-0.5 text-[10px] font-mono text-zinc-300 uppercase">
            SEC-L3
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          Secure access to infrastructure inspection operations
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        {errorMessage && (
          <div
            className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 backdrop-blur-md shadow-inner"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Username / Work Email / Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="inspector-identifier"
            className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono"
          >
            Work Email / Username
          </label>
          <input
            id="inspector-identifier"
            type="text"
            required
            autoComplete="username"
            placeholder="e.g. inspector@civic.gov"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            className="charcoal-glass-input w-full px-4 py-3 rounded-2xl text-white placeholder-zinc-500 font-sans focus:outline-none transition-all text-xs"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="inspector-password"
              className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono"
            >
              Password
            </label>
          </div>
          <input
            id="inspector-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            className="charcoal-glass-input w-full px-4 py-3 rounded-2xl text-white placeholder-zinc-500 font-sans focus:outline-none transition-all text-xs"
          />
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300 text-xs">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded-full bg-zinc-900 border-white/25 text-white focus:ring-0 w-3.5 h-3.5"
            />
            <span>Remember session</span>
          </label>
        </div>

        {/* Primary Action: SIGN IN (Luminous Pill Button) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="white-gloss-btn w-full py-3.5 px-5 rounded-full text-zinc-950 font-black text-xs tracking-wider uppercase shadow-2xl transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
        >
          <span>{isSubmitting ? 'AUTHENTICATING...' : 'SIGN IN TO WORKSPACE'}</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </button>

        {/* Optional Secondary Action: Request Authorized Access */}
        <div className="pt-2 text-center">
          {accessRequested ? (
            <span className="text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Access request logged for municipal administrator review.
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setAccessRequested(true)}
              className="text-[11px] text-zinc-400 hover:text-white transition-colors underline-offset-2 hover:underline font-mono"
            >
              Request Authorized Access
            </button>
          )}
        </div>

        {/* Demo Quick-Fill Credentials */}
        {demoOfficers && demoOfficers.length > 0 && (
          <div className="pt-3 border-t border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
              Demo Credentials Quick-Select:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {demoOfficers.slice(0, 2).map((off) => (
                <button
                  key={off.email}
                  type="button"
                  onClick={() => handleDemoSelect(off)}
                  className="obsidian-pill-glass px-3 py-2 text-[10px] text-zinc-300 hover:text-white hover:border-white/40 text-left font-mono truncate transition-all cursor-pointer"
                  title={`Select ${off.name}`}
                >
                  {off.name.split(' ')[0]} ({off.role.split('_')[0]})
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
