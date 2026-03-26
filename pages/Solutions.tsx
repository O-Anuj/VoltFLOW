
import React from 'react';
import { ArrowLeft, Briefcase, Rocket, Globe2, Building2, Check, ArrowRight } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

const Solutions: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          Built for every scale.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
          From garage startups to Fortune 500 enterprises, VaultFlow adapts to your organization's unique security and collaboration needs.
        </p>
      </div>

      <div className="space-y-24">
        
        {/* Startups */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                    <Rocket size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">For Fast-Moving Startups</h2>
                <p className="text-slate-600 mb-8 text-lg">
                    Focus on shipping your product, not managing infrastructure. VaultFlow gives you out-of-the-box security so you can close deals with enterprise clients who demand compliance.
                </p>
                <ul className="space-y-4 mb-8">
                    {['SOC2 Ready Infrastructure', 'Affordable scaling plans', 'Zero-setup collaboration'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="order-1 md:order-2 bg-gradient-to-br from-emerald-50 to-slate-50 border border-slate-200 rounded-3xl h-[400px] relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
                 <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl max-w-xs w-full rotate-3 transition-transform hover:rotate-0 duration-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100" />
                        <div className="h-2 w-24 bg-slate-100 rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-3/4 bg-slate-100 rounded" />
                        <div className="h-2 w-5/6 bg-slate-100 rounded" />
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <div className="h-6 w-16 bg-emerald-500 rounded-lg" />
                    </div>
                 </div>
            </div>
        </div>

        {/* Enterprise */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-900 rounded-3xl h-[400px] relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
                <div className="relative z-10 text-center">
                     <div className="text-5xl font-bold text-white mb-2 tracking-tighter">99.99%</div>
                     <div className="text-slate-400 font-medium tracking-widest uppercase text-sm">Uptime SLA</div>
                </div>
            </div>
            <div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    <Building2 size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">For Global Enterprises</h2>
                <p className="text-slate-600 mb-8 text-lg">
                    Scale without limits. Manage thousands of users with granular permission policies, SSO integration, and dedicated support channels.
                </p>
                <ul className="space-y-4 mb-8">
                    {['SAML / SSO Integration', 'Custom Data Residency', 'Dedicated Success Manager'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
      </div>
      
      <div className="mt-20 text-center">
        <button 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors mx-auto"
        >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
        </button>
      </div>
    </section>
  );
};

export default Solutions;
