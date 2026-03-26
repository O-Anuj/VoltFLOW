
import React from 'react';
import { Lock, Users, Activity, CheckCircle2, FileText, Search, MoreHorizontal } from 'lucide-react';

const HeroVisual: React.FC = () => {
  return (
    <div className="relative w-full mt-8 md:mt-16 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden group">
        {/* Abstract Background Blurs inside the card */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

        <div className="grid md:grid-cols-12 gap-0 min-h-[500px]">
            {/* Left Panel: Feature Showcase */}
            <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 bg-white/80 backdrop-blur-sm relative z-10 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 w-fit mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Live Preview</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                    Powerfully simple. <br/>Simply powerful.
                </h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm md:text-base">
                    Experience a workspace that feels familiar but is fortified with military-grade security protocols at every layer.
                </p>

                <div className="space-y-6">
                    {[
                        { icon: Lock, title: "End-to-End Encryption", desc: "Data is encrypted before it leaves your device." },
                        { icon: Users, title: "Granular Permissions", desc: "Role-based access control for every folder." },
                        { icon: Activity, title: "Real-time Audit Logs", desc: "Track every view, download, and file edit." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 group/item">
                            <div className="mt-1 w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 group-hover/item:text-emerald-600 group-hover/item:border-emerald-200 transition-all shadow-sm">
                                <item.icon size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Mock Dashboard UI */}
            <div className="md:col-span-7 bg-slate-50/50 p-6 md:p-12 relative flex items-center justify-center overflow-hidden">
                 {/* Mock Window */}
                 <div className="w-full max-w-[600px] bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden transform md:rotate-1 md:translate-x-6 transition-transform hover:rotate-0 hover:translate-x-0 duration-700 ease-out">
                    {/* Window Header */}
                    <div className="h-10 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50/80 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-400/30" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20 border border-yellow-400/30" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/20 border border-green-400/30" />
                        </div>
                        <div className="ml-4 flex-1 max-w-[200px] h-6 bg-slate-100 rounded-md flex items-center px-2">
                             <Lock size={10} className="text-slate-400 mr-1" />
                             <div className="w-20 h-1.5 bg-slate-200 rounded-full opacity-50" />
                        </div>
                    </div>

                    <div className="flex h-[340px]">
                        {/* Sidebar */}
                        <div className="w-40 border-r border-slate-100 p-4 hidden sm:block bg-slate-50/30">
                            <div className="w-24 h-5 bg-slate-200 rounded mb-6 opacity-70" />
                            <div className="space-y-1">
                                <div className="w-full h-8 bg-emerald-50 text-emerald-700 rounded-lg flex items-center px-3 text-xs font-bold border border-emerald-100/50">
                                   <FileText size={12} className="mr-2" /> Files
                                </div>
                                <div className="w-full h-8 text-slate-400 flex items-center px-3 text-xs hover:bg-slate-100 rounded-lg transition-colors">
                                   <Users size={12} className="mr-2" /> Shared
                                </div>
                                <div className="w-full h-8 text-slate-400 flex items-center px-3 text-xs hover:bg-slate-100 rounded-lg transition-colors">
                                   <Activity size={12} className="mr-2" /> Recent
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-6 relative">
                            {/* Toolbar */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">My Vault</h3>
                                <div className="flex gap-2">
                                   <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                                      <Search size={14} />
                                   </div>
                                   <div className="w-24 h-8 bg-emerald-600 rounded-lg shadow-sm shadow-emerald-200 flex items-center justify-center text-xs font-bold text-white">
                                      Upload
                                   </div>
                                </div>
                            </div>

                            {/* File List */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors bg-white shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center text-blue-500">
                                           <FileText size={14} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-700">Financial_Q4.pdf</div>
                                            <div className="text-[10px] text-slate-400">2.4 MB • Just now</div>
                                        </div>
                                    </div>
                                    <MoreHorizontal size={14} className="text-slate-300" />
                                </div>

                                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors bg-white shadow-sm opacity-90">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-center text-purple-500">
                                           <FileText size={14} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-700">Project_Alpha_Assets</div>
                                            <div className="text-[10px] text-slate-400">145 MB • 2 hrs ago</div>
                                        </div>
                                    </div>
                                    <MoreHorizontal size={14} className="text-slate-300" />
                                </div>

                                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors bg-white shadow-sm opacity-80">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-center text-orange-500">
                                           <Lock size={14} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-700">Client_Keys.txt</div>
                                            <div className="text-[10px] text-slate-400">4 KB • Yesterday</div>
                                        </div>
                                    </div>
                                    <MoreHorizontal size={14} className="text-slate-300" />
                                </div>
                            </div>
                            
                            {/* Floating Toast Notification */}
                            <div className="absolute bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl shadow-slate-900/10 flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-700 border border-white/10 z-30">
                                <div className="bg-emerald-500 rounded-full p-0.5">
                                   <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                                </div>
                                <span className="font-medium">File encrypted & saved</span>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default HeroVisual;
