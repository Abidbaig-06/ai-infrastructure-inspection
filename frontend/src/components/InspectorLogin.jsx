import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/routes';
import {
  Lock,
  Shield,
  AlertCircle,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  UserPlus,
  LogIn,
  Building,
  Mail,
  User,
  Briefcase
} from 'lucide-react';

export const InspectorLogin = () => {
  const { login, register, demoOfficers } = useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Sign In fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('FIELD_INSPECTOR');
  const [regDepartment, setRegDepartment] = useState('GMC Civil & Infrastructure Division');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

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
      setErrorMessage(err.message || 'Invalid credentials or unauthorized personnel identifier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Please enter your Official Work Email or Username.');
      return;
    }
    if (!regPassword || regPassword.length < 3) {
      setErrorMessage('Password must be at least 3 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        department: regDepartment
      });
      setSuccessMessage('Registration successful! Launching Authorized Workspace...');
      setTimeout(() => {
        navigate(ROUTES.INSPECTOR_WORKSPACE);
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSelect = (officer) => {
    setAuthMode('login');
    setIdentifier(officer.email);
    setPassword('demo');
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div
      id="inspector-auth-panel"
      className="charcoal-glass rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden text-zinc-100 transition-all duration-300 shadow-2xl border border-white/15"
      aria-labelledby="inspector-panel-title"
    >
      {/* Specular White Light Top Rim Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2
            id="inspector-panel-title"
            className="text-xs font-mono font-bold tracking-widest text-zinc-200 uppercase flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            AUTHORIZED INSPECTOR ACCESS
          </h2>
        </div>
        <p className="text-xs text-zinc-400">
          Secure access & account management for municipal infrastructure operations
        </p>

        {/* Tab Switch: Sign In vs Sign Up / Register */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10 mt-3">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'login'
                ? 'white-gloss-btn text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>SIGN IN</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'register'
                ? 'white-gloss-btn text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>SIGN UP / REGISTER</span>
          </button>
        </div>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div
          className="mt-4 p-3.5 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 backdrop-blur-md shadow-inner"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          className="mt-4 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 backdrop-blur-md shadow-inner"
          role="alert"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. SIGN IN FORM */}
      {/* ------------------------------------------------------------- */}
      {authMode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4 text-xs">
          {/* Username / Work Email / Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="inspector-identifier"
              className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3 text-zinc-400" />
              <span>Work Email / Username</span>
            </label>
            <input
              id="inspector-identifier"
              type="text"
              required
              autoComplete="username"
              placeholder="e.g. inspector@civic.gov or username"
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
                className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"
              >
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Password</span>
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

          {/* Remember me & Quick Switch */}
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
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
              }}
              className="text-[11px] text-zinc-400 hover:text-white font-mono transition-colors"
            >
              New Inspector? <span className="underline font-bold text-white">Register</span>
            </button>
          </div>

          {/* Primary Action: SIGN IN */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="white-gloss-btn w-full py-3.5 px-5 rounded-full text-zinc-950 font-black text-xs tracking-wider uppercase shadow-2xl transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
          >
            <span>{isSubmitting ? 'AUTHENTICATING...' : 'SIGN IN TO WORKSPACE'}</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </button>

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
      ) : (
        /* ------------------------------------------------------------- */
        /* 2. SIGN UP / REGISTRATION FORM */
        /* ------------------------------------------------------------- */
        <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-name"
              className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"
            >
              <User className="w-3 h-3 text-zinc-400" />
              <span>Full Name *</span>
            </label>
            <input
              id="reg-name"
              type="text"
              required
              placeholder="e.g. Engineer Vikram Sethi"
              value={regName}
              onChange={(e) => {
                setRegName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="charcoal-glass-input w-full px-4 py-2.5 rounded-2xl text-white placeholder-zinc-500 font-sans focus:outline-none transition-all text-xs"
            />
          </div>

          {/* Official Work Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-email"
              className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3 text-zinc-400" />
              <span>Official Work Email / Username *</span>
            </label>
            <input
              id="reg-email"
              type="text"
              required
              placeholder="e.g. vikram.sethi@gmc.gov.in"
              value={regEmail}
              onChange={(e) => {
                setRegEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="charcoal-glass-input w-full px-4 py-2.5 rounded-2xl text-white placeholder-zinc-500 font-sans focus:outline-none transition-all text-xs"
            />
          </div>

          {/* Role & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label
                htmlFor="reg-role"
                className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"
              >
                <Briefcase className="w-3 h-3 text-zinc-400" />
                <span>Designation Role *</span>
              </label>
              <select
                id="reg-role"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="charcoal-glass-input w-full px-3 py-2.5 rounded-2xl text-white bg-zinc-900 focus:outline-none text-xs cursor-pointer"
              >
                <option value="FIELD_INSPECTOR">Field Infrastructure Inspector</option>
                <option value="SENIOR_ENGINEER">Senior Structural Engineer</option>
                <option value="DISPATCH_OFFICER">GMC Dispatch Commander</option>
                <option value="WARD_OFFICER">Municipal Ward Officer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reg-dept"
                className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"
              >
                <Building className="w-3 h-3 text-zinc-400" />
                <span>Department</span>
              </label>
              <input
                id="reg-dept"
                type="text"
                value={regDepartment}
                onChange={(e) => setRegDepartment(e.target.value)}
                placeholder="GMC Civil Operations"
                className="charcoal-glass-input w-full px-3 py-2.5 rounded-2xl text-white placeholder-zinc-500 font-sans focus:outline-none transition-all text-xs"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label
                htmlFor="reg-password"
                className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"
              >
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Password *</span>
              </label>
              <input
                id="reg-password"
                type="password"
                required
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => {
                  setRegPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="charcoal-glass-input w-full px-3.5 py-2.5 rounded-2xl text-white placeholder-zinc-500 font-sans focus:outline-none transition-all text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reg-confirm-password"
                className="block font-medium text-zinc-300 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5"
              >
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Confirm *</span>
              </label>
              <input
                id="reg-confirm-password"
                type="password"
                required
                placeholder="••••••••"
                value={regConfirmPassword}
                onChange={(e) => {
                  setRegConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="charcoal-glass-input w-full px-3.5 py-2.5 rounded-2xl text-white placeholder-zinc-500 font-sans focus:outline-none transition-all text-xs"
              />
            </div>
          </div>

          {/* Submit Registration Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="white-gloss-btn w-full py-3.5 px-5 rounded-full text-zinc-950 font-black text-xs tracking-wider uppercase shadow-2xl transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer mt-2"
          >
            <span>{isSubmitting ? 'CREATING PROFILE...' : 'CREATE INSPECTOR ACCOUNT & ENTER'}</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </button>

          {/* Switch to Sign In */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-[11px] text-zinc-400 hover:text-white font-mono transition-colors"
            >
              Already have an authorized profile? <span className="underline font-bold text-white">Sign In</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
