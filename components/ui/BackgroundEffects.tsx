import React from 'react';

const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Light Base */}
      <div className="absolute inset-0 bg-slate-50" />

      {/* Radial Gradient Glow - Top Center */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-100/60 blur-[120px] rounded-full opacity-60 mix-blend-multiply" />
      
      {/* Radial Gradient Glow - Bottom Left */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50/80 blur-[100px] rounded-full opacity-50" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

      {/* Subtle Grain (Optional) */}
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")' }} />
    </div>
  );
};

export default BackgroundEffects;