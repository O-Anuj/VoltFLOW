
import React from 'react';
import { Check } from 'lucide-react';

interface PricingPreviewProps {
    onNavigate: (path: string) => void;
}

const PricingPreview: React.FC<PricingPreviewProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 px-6 relative bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">Start for free, scale as you grow. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="mb-4">
               <h3 className="text-lg font-bold text-slate-900">Starter</h3>
               <div className="text-3xl font-bold text-slate-900 mt-2">$0 <span className="text-sm font-medium text-slate-500">/mo</span></div>
            </div>
            <p className="text-sm text-slate-500 mb-6">Perfect for individuals.</p>
            <div className="space-y-3 mb-8 flex-1">
               <div className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> 5 GB Storage</div>
               <div className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> Basic Encryption</div>
               <div className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> Community Support</div>
            </div>
            <button onClick={() => onNavigate('/pricing')} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">Compare Plans</button>
          </div>

          {/* Pro */}
          <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-32 h-32 bg-emerald-500 rounded-full blur-3xl" />
            </div>
            <div className="mb-4 relative z-10">
               <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white">Pro</h3>
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Popular</span>
               </div>
               <div className="text-3xl font-bold text-white mt-2">$29 <span className="text-sm font-medium text-slate-400">/mo</span></div>
            </div>
            <p className="text-sm text-slate-400 mb-6 relative z-10">For growing teams.</p>
             <div className="space-y-3 mb-8 relative z-10 flex-1">
               <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-400"/> 1 TB Storage</div>
               <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-400"/> Advanced Roles</div>
               <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-400"/> Priority Support</div>
               <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-emerald-400"/> 30-day Version History</div>
            </div>
            <button onClick={() => onNavigate('/pricing')} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-colors relative z-10 shadow-lg shadow-emerald-900/20">Get Started</button>
          </div>

          {/* Business */}
           <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="mb-4">
               <h3 className="text-lg font-bold text-slate-900">Business</h3>
               <div className="text-3xl font-bold text-slate-900 mt-2">$99 <span className="text-sm font-medium text-slate-500">/mo</span></div>
            </div>
            <p className="text-sm text-slate-500 mb-6">For large organizations.</p>
             <div className="space-y-3 mb-8 flex-1">
               <div className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> Unlimited Storage</div>
               <div className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> SSO & Audit Logs</div>
               <div className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-emerald-500"/> 24/7 Dedicated Support</div>
            </div>
            <button onClick={() => onNavigate('/pricing')} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
