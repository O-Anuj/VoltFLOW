
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import TrustedBy from './components/TrustedBy';
import Stats from './components/Stats';
import PricingPreview from './components/PricingPreview';
import FinalCTA from './components/FinalCTA';
import BackgroundEffects from './components/ui/BackgroundEffects';
import AuthModal from './components/AuthModal';
import { ArrowRight, Loader2 } from 'lucide-react';

// Auth
import { useAuth } from './lib/AuthContext';

// Page Imports
import Product from './pages/Product';
import Solutions from './pages/Solutions';
import Pricing from './pages/Pricing';
import Support from './pages/Support';
import Dashboard from './pages/Dashboard';
import DemoDashboard from './pages/DemoDashboard';

const App: React.FC = () => {
  // Initialize from hash, remove the '#' character. Default to '/' if empty.
  const getHashPath = () => window.location.hash.slice(1) || '/';
  
  const [currentPath, setCurrentPath] = useState(getHashPath());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { user, loading } = useAuth();

  // Handle Hash Changes
  useEffect(() => {
    const onHashChange = () => {
      setCurrentPath(getHashPath());
      window.scrollTo(0, 0);
    };
    
    // Listen for hash changes (back/forward button or manual hash change)
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  // Protect Dashboard Route
  useEffect(() => {
    if (!loading && currentPath === '/dashboard' && !user) {
      // If user tries to access dashboard but not logged in, redirect home and open auth modal
      navigate('/');
      setIsAuthModalOpen(true);
    }
  }, [loading, currentPath, user]);

  const renderContent = () => {
    switch (currentPath) {
      case '/dashboard':
        if (loading) return (
          <div className="min-h-screen flex items-center justify-center pt-20">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        );
        if (!user) return null;
        return <Dashboard onNavigate={navigate} onOpenAuth={openAuthModal} />;
      case '/demo':
        return <DemoDashboard onNavigate={navigate} />;
      case '/product':
        return <Product onNavigate={navigate} />;
      case '/solutions':
        return <Solutions onNavigate={navigate} />;
      case '/pricing':
        return <Pricing onNavigate={navigate} onOpenAuth={openAuthModal} />;
      case '/support':
        return <Support onNavigate={navigate} />;
      case '/':
      default:
        return (
          <>
            <Hero onOpenAuth={openAuthModal} onNavigate={navigate} />
            <TrustedBy />
            <Features />
            <Stats />
            <PricingPreview onNavigate={navigate} />
            <FinalCTA onOpenAuth={openAuthModal} />
          </>
        );
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      <BackgroundEffects />
      
      <div className="relative z-10">
        <Navbar onNavigate={navigate} onOpenAuth={openAuthModal} />
        <main>
          {renderContent()}
        </main>
      </div>
      
      {/* Decorative footer gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-0" />
      
      {/* Simple Footer (Hide on dashboard/demo to reduce clutter) */}
      {currentPath !== '/dashboard' && currentPath !== '/demo' && (
        <footer className="relative z-10 py-12 px-6 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="font-bold text-slate-900">VaultFlow</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <p className="text-sm text-slate-500 text-center md:text-left">
                The secure choice for modern businesses. <br className="md:hidden" /> Trusted by teams globally.
              </p>
              {!user && (
                <button 
                  onClick={openAuthModal}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] flex items-center gap-2 group whitespace-nowrap"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

            <div className="flex gap-8 text-sm font-medium text-slate-600">
              <a href="#" onClick={(e) => { e.preventDefault(); }} className="hover:text-emerald-600 transition-colors">Privacy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); }} className="hover:text-emerald-600 transition-colors">Terms</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }} className="hover:text-emerald-600 transition-colors">Pricing</a>
            </div>
          </div>
        </footer>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default App;
