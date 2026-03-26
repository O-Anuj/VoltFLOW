
import React from 'react';
import { Lock, Share2, Users, ShieldCheck, Gavel, Zap, Globe, Key } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div className={`group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${delay}`}>
      <div className="w-12 h-12 mb-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Bank-Grade Encryption",
      description: "Your data is encrypted at rest and in transit using AES-256 protocols.",
      delay: "delay-100"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Sync",
      description: "Proprietary delta-sync technology ensures your files update instantly across devices.",
      delay: "delay-200"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Granular Access Control",
      description: "Define precise permissions for every team member, down to the file level.",
      delay: "delay-300"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global CDN",
      description: "Access your secure vault from anywhere with low latency edge caching.",
      delay: "delay-[400ms]"
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to secure your work
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Powerful features designed for modern teams who refuse to compromise on security or speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard 
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
