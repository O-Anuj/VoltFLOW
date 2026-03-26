
import React from 'react';
import { ArrowLeft, Shield, Zap, Globe, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

const Product: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-800 uppercase tracking-wide">
            Product Tour
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          Security without compromise.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
          VaultFlow combines military-grade encryption with the intuitive experience of modern consumer apps. Protect your intellectual property without slowing down your team.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-24">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
            <Lock size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Zero-Knowledge Architecture</h3>
          <p className="text-slate-600 leading-relaxed">
            Your data is encrypted on your device before it ever reaches our servers. We cannot see your files, and neither can hackers. You hold the only keys.
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group">
           <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <Globe size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Global Edge Distribution</h3>
          <p className="text-slate-600 leading-relaxed">
            Access your secure vault from anywhere with low latency. Our intelligent edge network routes your encrypted data to the nearest node for lightning-fast sync.
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group">
           <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
            <Shield size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Advanced Compliance</h3>
          <p className="text-slate-600 leading-relaxed">
            Automated SOC2 and HIPAA compliance reporting. Immutable audit logs track every file access, modification, and sharing event.
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group">
           <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
            <Zap size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Seamless Integration</h3>
          <p className="text-slate-600 leading-relaxed">
            Connect VaultFlow with your identity provider (Okta, Azure AD) and existing workflow tools. No clunky VPNs required.
          </p>
        </div>
      </div>

      {/* Value Prop Section */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-white text-center mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your workspace?</h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join over 10,000 forward-thinking companies who trust VaultFlow with their most critical assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
                onClick={() => onNavigate('/')} 
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
             >
                Get Started Now
                <ArrowRight size={18} />
             </button>
             <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-all backdrop-blur-sm border border-white/10">
                Contact Sales
             </button>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onNavigate('/')}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>
    </section>
  );
};

export default Product;
