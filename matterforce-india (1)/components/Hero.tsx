import React from 'react';
import { ArrowRight, Cpu, HeartHandshake } from 'lucide-react';
import { ViewState } from '../types';

interface HeroProps {
  setView: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-matter-dark bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
      
      {/* Glow effects */}
      <div className="absolute top-0 right-0 -z-10 opacity-20 blur-3xl overflow-hidden">
        <div className="h-[500px] w-[500px] rounded-full bg-matter-orange/30 translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-10 blur-3xl overflow-hidden">
        <div className="h-[400px] w-[400px] rounded-full bg-matter-blue/30 -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <span className="inline-flex items-center rounded-full bg-matter-blue/10 px-3 py-1 text-xs font-medium text-matter-blue ring-1 ring-inset ring-matter-blue/30">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-matter-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-matter-blue"></span>
              </span>
              MatterForce India: Your Engineering Partner
            </span>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl font-sans">
            We don't just sell parts. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-matter-blue to-matter-orange">We Understand Intent.</span>
          </h1>
          
          <div className="mt-10 flex items-center gap-x-6">
            <button 
              onClick={() => setView('FOUNDRY')}
              className="group flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-matter-dark shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-slate-100 transition-all duration-300"
            >
              Start Your Build
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => setView('BAZAAR')}
              className="text-sm font-semibold leading-6 text-white hover:text-matter-orange transition-colors uppercase tracking-wide"
            >
              Browse Parts <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        
        {/* Hero Visual Cards */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="flex gap-4 p-4">
                 
                 {/* Card 1: The Foundry */}
                 <div 
                   onClick={() => setView('FOUNDRY')}
                   className="w-64 cursor-pointer overflow-hidden rounded-xl bg-matter-surface border border-matter-border hover:border-matter-blue/50 transition-all hover:-translate-y-2 group"
                 >
                   <div className="h-36 bg-gradient-to-br from-matter-border to-black flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                      <Cpu className="h-16 w-16 text-slate-700 group-hover:text-matter-blue transition-colors duration-500" />
                   </div>
                   <div className="p-5 border-t border-white/5">
                     <h3 className="text-white font-bold font-mono text-lg group-hover:text-matter-blue transition-colors">THE FOUNDRY</h3>
                     <p className="text-slate-500 text-xs mt-2 leading-relaxed">Adaptive AI. Determines context & budget.</p>
                   </div>
                 </div>

                 {/* Card 2: The Bazaar */}
                 <div 
                   onClick={() => setView('BAZAAR')}
                   className="w-64 cursor-pointer overflow-hidden rounded-xl bg-matter-surface border border-matter-border hover:border-matter-orange/50 transition-all hover:-translate-y-2 group"
                 >
                   <div className="h-36 bg-gradient-to-br from-matter-border to-black flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                      <HeartHandshake className="h-16 w-16 text-slate-700 group-hover:text-matter-orange transition-colors duration-500" />
                   </div>
                   <div className="p-5 border-t border-white/5">
                     <h3 className="text-white font-bold font-mono text-lg group-hover:text-matter-orange transition-colors">THE BAZAAR</h3>
                     <p className="text-slate-500 text-xs mt-2 leading-relaxed">Price optimized. Hobby to Industrial grade.</p>
                   </div>
                 </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;