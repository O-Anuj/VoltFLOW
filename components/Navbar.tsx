
import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface NavbarProps {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Product', path: '/product' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Support', path: '/support' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('/');
    onOpenAuth();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-6xl rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border ring-1 ring-inset ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-white/60 ring-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3'
          : 'bg-white/40 backdrop-blur-lg border-white/40 ring-white/10 shadow-none py-4'
      }`}
    >
      <div className="px-8 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#/" 
          onClick={(e) => handleNavClick(e, '/')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Shield className="w-7 h-7 text-emerald-600 fill-emerald-600/10 group-hover:fill-emerald-600/20 transition-all duration-300 transform group-hover:scale-105" />
          </div>
          <span className="text-[18px] font-extrabold tracking-tight text-slate-950 transition-colors duration-300">
            VaultFlow
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`#${link.path}`}
              onClick={(e) => handleNavClick(e, link.path)}
              className="relative text-[14px] font-bold text-slate-600 hover:text-slate-900 transition-colors duration-300 group tracking-tight"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-300 group-hover:w-full rounded-full" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button 
                onClick={() => onNavigate('/dashboard')}
                className="relative overflow-hidden rounded-xl bg-slate-900 px-5 py-2.5 text-[13px] font-bold text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>
              <button
                onClick={handleSignOut}
                className="p-2.5 text-slate-500 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="relative overflow-hidden rounded-xl bg-emerald-600 px-6 py-2.5 text-[13px] font-bold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[calc(100%+1rem)] left-0 right-0 bg-white/95 backdrop-blur-3xl border border-white/60 p-6 md:hidden flex flex-col gap-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-3xl animate-in fade-in zoom-in-95 duration-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`#${link.path}`}
              className="text-slate-600 hover:text-emerald-600 font-bold py-3 text-base transition-colors border-b border-slate-50 last:border-0 text-center"
              onClick={(e) => handleNavClick(e, link.path)}
            >
              {link.name}
            </a>
          ))}
          
          {user ? (
            <>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('/dashboard');
                }}
                className="w-full mt-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button 
                onClick={handleSignOut}
                className="w-full rounded-xl border border-slate-200 px-6 py-4 text-sm font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full mt-2 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-200"
            >
              Get Started Free
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
