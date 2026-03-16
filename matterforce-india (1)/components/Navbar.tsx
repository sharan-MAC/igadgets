import React from 'react';
import { ShoppingCart, Cpu, Store, User, Hexagon, Clapperboard } from 'lucide-react';
import { ViewState, CartItem } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  cart: CartItem[];
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cart }) => {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-matter-border bg-matter-dark/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          className="flex cursor-pointer items-center gap-3 group" 
          onClick={() => setView('HOME')}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-matter-orange/10 text-matter-orange ring-1 ring-matter-orange/30 group-hover:ring-matter-orange/60 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-300">
            <Hexagon className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white font-mono uppercase">MatterForce</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-matter-orange/80">Hardware Intelligence</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => setView('FOUNDRY')}
            className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 uppercase tracking-wide
              ${currentView === 'FOUNDRY' ? 'text-matter-orange glow-text' : 'text-slate-400 hover:text-white'}`}
          >
            <Cpu className="h-4 w-4" />
            The Foundry
          </button>
          <button 
            onClick={() => setView('SIMULATION')}
            className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 uppercase tracking-wide
              ${currentView === 'SIMULATION' ? 'text-matter-orange glow-text' : 'text-slate-400 hover:text-white'}`}
          >
            <Clapperboard className="h-4 w-4" />
            Simulation
          </button>
          <button 
            onClick={() => setView('BAZAAR')}
            className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 uppercase tracking-wide
              ${currentView === 'BAZAAR' ? 'text-matter-orange glow-text' : 'text-slate-400 hover:text-white'}`}
          >
            <Store className="h-4 w-4" />
            The Bazaar
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('CART')}
            className={`relative p-2 transition-colors ${currentView === 'CART' ? 'text-matter-orange' : 'text-slate-400 hover:text-white'}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-matter-orange text-[10px] font-bold text-matter-dark animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setView('PROFILE')}
            className={`p-2 transition-colors ${currentView === 'PROFILE' ? 'text-matter-orange' : 'text-slate-400 hover:text-white'}`}
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;