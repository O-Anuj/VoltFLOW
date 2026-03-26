
import React from 'react';
import { ArrowLeft, Search, Book, MessageCircle, FileQuestion, Mail } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

const Support: React.FC<PageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: "Is VaultFlow really zero-knowledge?",
      a: "Yes. All encryption happens client-side. We do not have access to your keys or your data."
    },
    {
      q: "Can I recover deleted files?",
      a: "Pro and Business plans include 30-day version history and trash recovery. Free plans have 7-day recovery."
    },
    {
      q: "Do you offer SSO?",
      a: "Yes, SAML SSO integration is available on Business and Enterprise plans."
    },
    {
      q: "What happens if I downgrade my plan?",
      a: "Your files remain secure, but you will be locked from uploading new files if you exceed the storage limit of the new plan."
    }
  ];

  return (
    <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">
          How can we help?
        </h1>
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search for answers..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Book size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Documentation</h3>
          <p className="text-sm text-slate-500">Guides on getting started, API references, and security whitepapers.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <MessageCircle size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Community Forum</h3>
          <p className="text-sm text-slate-500">Connect with other developers and share best practices.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Mail size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Contact Support</h3>
          <p className="text-sm text-slate-500">Direct line to our engineering team for critical issues.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <FileQuestion className="text-emerald-600" />
            Frequently Asked Questions
        </h2>
        <div className="space-y-4">
            {faqs.map((faq, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="mt-16 text-center">
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

export default Support;
