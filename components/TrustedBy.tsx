
import React from 'react';
import { Layers, Command, Cpu, Globe, Server } from 'lucide-react';

const TrustedBy: React.FC = () => {
  return (
    <section className="py-10 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Trusted by teams worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
           {/* Fake Logo 1 */}
           <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
             <Layers className="w-6 h-6" /> ACME Corp
           </div>
           {/* Fake Logo 2 */}
           <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
             <Command className="w-6 h-6" /> Vertex
           </div>
           {/* Fake Logo 3 */}
           <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
             <Cpu className="w-6 h-6" /> TechFlow
           </div>
           {/* Fake Logo 4 */}
           <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
             <Globe className="w-6 h-6" /> GlobalScale
           </div>
           {/* Fake Logo 5 */}
           <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
             <Server className="w-6 h-6" /> DataBase
           </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
