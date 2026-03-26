
import React from 'react';
import { ArrowRight, PlayCircle, Loader2, LayoutDashboard, Settings } from 'lucide-react';
import HeroVisual from './HeroVisual';
import { useAuth } from '../lib/AuthContext';

interface HeroProps {
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAuth, onNavigate }) => {
  const { user, loading } = useAuth();

  const getFirstName = () => {
    if (user?.displayName) return user.displayName.split(' ')[0];
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <section className="relative pt-48 pb-40 px-6 flex flex-col items-center justify-center text-center max-w-7xl mx-auto min-h-[90vh]">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-10 hover:bg-emerald-100/50 hover:border-emerald-200 transition-all cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm group">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[11px] font-bold text-emerald-800 tracking-widest uppercase group-hover:text-emerald-900">
          Secure Storage · Built for Teams
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="max-w-5xl text-5xl md:text-7xl font-extrabold tracking-tight text-slate-950 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 leading-[1.15]">
        The secure workspace for <br />
        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 bg-[length:200%_auto] animate-[pulse_5s_ease-in-out_infinite] pb-2">
          modern teams
        </span>
      </h1>

      {/* Subheadline - Improved readability */}
      <p className="max-w-2xl text-xl text-slate-600 mb-16 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        Enterprise-grade security meets consumer-grade design. Securely manage assets, control permissions, and scale your organization with zero compromise.
      </p>

      {/* Auth Aware CTA Section */}
      <div className="w-full flex justify-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 min-h-[56px] relative z-20">
        
        {loading ? (
          <div className="flex items-center justify-center w-full sm:w-auto px-12 py-3">
             <Loader2 className="w-6 h-6 text-emerald-600 animate-spin opacity-50" />
          </div>
        ) : user ? (
          // Logged In - Dashboard Card
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 ring-1 ring-slate-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] p-8 rounded-3xl flex flex-col items-center gap-6 max-w-lg w-full animate-in zoom-in-95 duration-500 hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.15)] transition-all">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Active Session</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                    Welcome back, {getFirstName()}
                </h3>
                <p className="text-slate-500 font-medium text-sm">
                    Your secure vault is ready. You have full access.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                    onClick={() => onNavigate('/dashboard')}
                    className="flex-1 px-6 py-3.5 rounded-xl text-white font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-emerald-600 to-emerald-500 flex items-center justify-center gap-2"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </button>
                <button 
                    onClick={() => onNavigate('/settings')} 
                    className="flex-1 px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <Settings className="w-4 h-4" />
                    Manage
                </button>
            </div>
          </div>
        ) : (
          // Logged Out - Standard CTAs
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-10 py-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-1 transition-all duration-500 bg-emerald-600 flex items-center justify-center gap-2 group active:scale-95 text-base"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => onNavigate('/demo')}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-white border border-slate-200 text-slate-900 font-bold transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 flex items-center justify-center gap-2 group text-base shadow-sm"
            >
              <PlayCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              Live Demo (No Login)
            </button>
          </div>
        )}
      </div>

      {/* Hero Visual */}
      <div className="w-full max-w-6xl relative animate-in fade-in zoom-in duration-1000 delay-500">
        <HeroVisual />
      </div>

    </section>
  );
};

export default Hero;
