
import React from 'react';

const Stats: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">99.99%</div>
            <div className="text-slate-500 font-medium">Uptime Guarantee</div>
          </div>
          <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">5M+</div>
            <div className="text-slate-500 font-medium">Files Secured</div>
          </div>
          <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">10k+</div>
            <div className="text-slate-500 font-medium">Teams Onboarded</div>
          </div>
        </div>
        
        {/* Optional Quote */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
            <p className="text-lg text-slate-600 italic">"VaultFlow transformed how we handle sensitive data. It's security that doesn't get in the way."</p>
            <div className="mt-4 flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full" />
                <div className="text-sm font-bold text-slate-900">Sarah Jenkins, CTO at TechFlow</div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
