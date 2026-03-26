
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

const Pricing: React.FC<PageProps> = ({ onNavigate, onOpenAuth }) => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "For individuals just getting started.",
      features: ["5 GB Encrypted Storage", "1 User", "Basic File Sharing", "Community Support"],
      cta: "Get Started Free",
      highlight: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      description: "For professional teams needing power.",
      features: ["1 TB Encrypted Storage", "5 Users Included", "Advanced Permissions", "Priority Email Support", "Version History (30 Days)"],
      cta: "Upgrade to Pro",
      highlight: true
    },
    {
      name: "Business",
      price: "$99",
      period: "/mo",
      description: "For growing organizations.",
      features: ["5 TB Encrypted Storage", "Unlimited Users", "SSO & Audit Logs", "24/7 Priority Support", "Unlimited Version History"],
      cta: "Contact Sales",
      highlight: false
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large scale security needs.",
        features: ["Unlimited Storage", "Dedicated Instance", "Custom SLA", "On-premise Deployment", "Dedicated Account Manager"],
        cta: "Contact Sales",
        highlight: false
    }
  ];

  return (
    <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Simple, transparent pricing.
        </h1>
        <p className="text-lg text-slate-600">
          Choose the plan that fits your security needs. No hidden fees.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`flex flex-col p-6 rounded-2xl border ${
              plan.highlight 
                ? 'bg-emerald-50/50 border-emerald-200 shadow-xl shadow-emerald-100 relative' 
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            } transition-all duration-300`}
          >
            {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                </div>
            )}
            <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
            <p className="text-sm text-slate-500 mb-6 h-10">{plan.description}</p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
              {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
            </div>

            <div className="flex-1 space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className={`w-4 h-4 mt-0.5 ${plan.highlight ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={onOpenAuth}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                plan.highlight 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-200' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center bg-slate-50 rounded-2xl p-8 max-w-3xl mx-auto border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-2">Need a custom contract?</h3>
        <p className="text-slate-600 text-sm mb-4">
            We offer custom Data Processing Agreements (DPA) and invoicing for enterprise teams.
        </p>
        <button onClick={() => onNavigate('/support')} className="text-emerald-600 font-bold text-sm hover:underline">
            Contact Support Team &rarr;
        </button>
      </div>

      <div className="mt-12 text-center">
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

export default Pricing;
