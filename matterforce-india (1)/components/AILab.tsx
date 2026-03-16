import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Cpu, Hammer, Box, Plus, Search, CheckCircle, FileText, ChevronRight, BrainCircuit, ShieldCheck, BookOpen, AlertTriangle, RefreshCw, XCircle, Scan, Target, Aperture, MousePointer2 } from 'lucide-react';
import { generateHardwareSpecs } from '../services/geminiService';
import { AIProductResult, CartItem } from '../types';

interface AILabProps {
  addToCart: (item: CartItem) => void;
}

const AILab: React.FC<AILabProps> = ({ addToCart }) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [result, setResult] = useState<AIProductResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Market Sweep Simulation Text
  useEffect(() => {
    if (!isAnalyzing) return;
    const steps = [
      "Analyzing User Intent...",
      "Determining Complexity Tier...",
      "Checking Student vs Industrial Safety...",
      "Sweeping Indian Marketplaces...",
      "Optimizing for Lowest Valid Price...",
      "Generating Empathetic Guide..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setAnalysisStep(steps[i % steps.length]);
      i++;
    }, 800);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await generateHardwareSpecs(prompt);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to engineer product.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToCart = (type: 'DIY_KIT' | 'ASSEMBLED') => {
    if (!result) return;
    // Create a stable deterministic ID based on the product name and type
    const stableId = `ai-${result.productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${type.toLowerCase()}`;
    
    const item: CartItem = {
      id: stableId,
      name: `${result.productName} (${type === 'DIY_KIT' ? 'Maker Kit' : 'Masterpiece'})`,
      type,
      price: type === 'DIY_KIT' ? result.diyPrice : result.assembledPrice,
      quantity: 1,
      image: `https://picsum.photos/seed/${result.productName.replace(/\s/g,'')}/400/400`,
      details: type === 'DIY_KIT' ? 'Components + Adaptive Guide' : 'Professionally Assembled & Tested',
      assemblyGuide: type === 'DIY_KIT' ? result.assemblySteps : undefined,
      tier: result.complexityTier
    };
    addToCart(item);
  };

  // Dynamic Theme Colors based on Tier
  const isIndustrial = result?.complexityTier === 'TIER_3_INDUSTRIAL';
  const themeColor = isIndustrial ? 'text-matter-orange' : 'text-matter-blue';
  const borderColor = isIndustrial ? 'border-matter-orange' : 'border-matter-blue';
  const bgColor = isIndustrial ? 'bg-matter-orange' : 'bg-matter-blue';
  const glowShadow = isIndustrial ? 'shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'shadow-[0_0_15px_rgba(59,130,246,0.5)]';

  return (
    <div className="min-h-screen bg-matter-dark pb-20 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 border-l-4 border-white pl-4">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3 font-mono uppercase">
            The Foundry
          </h2>
          <p className="mt-1 text-slate-400">Where Intent meets Engineering.</p>
        </div>

        {/* Input Console */}
        <div className="rounded-xl bg-matter-surface border border-matter-border p-1 shadow-2xl shadow-black/50">
          <div className="relative overflow-hidden rounded-lg bg-black">
             <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Tell us what you want to build. e.g., "A solar fan for a school project" or "A crop monitoring drone for my farm."'
              className="w-full h-32 bg-transparent p-6 text-lg text-white placeholder-slate-600 focus:outline-none resize-none font-mono"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={isAnalyzing || !prompt.trim()}
                className={`flex items-center gap-2 rounded-none px-6 py-2 text-sm font-bold tracking-wider uppercase border transition-all
                  ${isAnalyzing || !prompt.trim() 
                    ? 'border-slate-700 bg-slate-900 text-slate-500 cursor-not-allowed' 
                    : 'border-white bg-white/5 text-white hover:bg-white hover:text-black'}`}
              >
                {isAnalyzing ? (
                  <>
                    <BrainCircuit className="h-4 w-4 animate-pulse" />
                    Analyzing Intent...
                  </>
                ) : (
                  <>
                    Initialize Engine
                    <Terminal className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading Visual */}
        {isAnalyzing && (
            <div className="mt-12 border border-white/10 bg-white/5 rounded-xl p-8 flex flex-col items-center justify-center space-y-6">
                <div className="font-mono text-white text-lg">
                  {`> ${analysisStep}`}
                  <span className="animate-blink">_</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full max-w-md h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-white animate-progress origin-left w-full" style={{ animationDuration: '4s' }}></div>
                </div>
            </div>
        )}

        {/* Dedicated Error Component */}
        {error && (
            <div className="mt-12 mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative overflow-hidden rounded-lg bg-red-950/10 border border-red-500/30 p-8">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex-shrink-0">
                            <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-500" />
                                Engineering Process Halted
                            </h3>
                            <div className="mt-3 font-mono text-sm text-red-400 bg-black/40 p-4 rounded border border-red-500/20">
                                <span className="text-red-600 font-bold select-none">{`> ERROR_CODE: `}</span>
                                {error}
                            </div>
                            <p className="mt-3 text-slate-400 text-sm">
                                The AI foundry encountered an unexpected parameter. Please refine your input or retry the generation sequence.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-4 border-t border-red-500/20 pt-6">
                        <button 
                             onClick={() => setError(null)}
                             className="text-xs text-slate-500 hover:text-white uppercase tracking-wider font-bold px-4 py-2 transition-colors"
                        >
                            Dismiss Report
                        </button>
                        <button 
                            onClick={handleGenerate}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-sm transition-all uppercase text-xs font-bold tracking-wider shadow-lg shadow-red-900/20"
                        >
                            <RefreshCw className="h-3 w-3" /> 
                            Re-initialize Sequence
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Results Dashboard */}
        {result && !isAnalyzing && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            
            {/* INTENT ANALYSIS CARD */}
            <div className={`mb-8 p-6 rounded-lg border ${borderColor} bg-opacity-10 bg-black relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${bgColor}`}></div>
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${bgColor} bg-opacity-20`}>
                        <BrainCircuit className={`w-8 h-8 ${themeColor}`} />
                    </div>
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${themeColor} mb-1`}>
                            Intent Detected: {result.complexityTier.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-white text-lg leading-relaxed">
                            "{result.intentAnalysis}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              
              {/* Left Column: Specs */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                    <h3 className="text-3xl font-bold text-white font-mono uppercase tracking-tight">{result.productName}</h3>
                    <div className="flex gap-2 mt-3">
                      <span className="inline-block rounded-none border border-matter-border bg-slate-900 px-2 py-1 text-xs font-mono text-slate-400">
                          {result.category}
                      </span>
                      <span className={`inline-block rounded-none border ${borderColor} bg-black px-2 py-1 text-xs font-mono ${themeColor}`}>
                          EST. TIME: {result.estimatedBuildTime}
                      </span>
                    </div>
                    <p className="mt-4 text-lg text-slate-300 leading-relaxed font-light">{result.description}</p>
                </div>

                {/* Technical Specs */}
                <div className="bg-matter-surface border border-matter-border p-6 rounded-sm">
                  <h4 className={`text-xs font-bold ${themeColor} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                     Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
                    {result.technicalSpecs.map((spec, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-slate-300 font-mono text-sm border-b border-white/5 pb-2">
                        <span className={`${themeColor} text-xs mt-1`}>0{idx+1}</span>
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Visualization - ENHANCED */}
              <div className="relative rounded-xl overflow-hidden bg-black border border-matter-border aspect-square lg:aspect-auto flex flex-col group perspective-1000">
                 {/* Tech Grid Background */}
                 <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                 
                 {/* Radial Gradient Glow */}
                 <div className={`absolute inset-0 bg-radial-gradient from-${isIndustrial ? 'matter-orange' : 'matter-blue'}/20 to-transparent opacity-50`}></div>

                 {/* 3D Container for Image */}
                 <div className="relative w-full h-full flex items-center justify-center p-8 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1">
                    
                    {/* The "Hologram" Image */}
                    <div className="relative w-full h-full max-h-[400px] max-w-[400px]">
                        {/* Spinning Rings behind */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-${isIndustrial ? 'matter-orange' : 'matter-blue'}/20 rounded-full animate-spin-slow`}></div>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-dashed border-${isIndustrial ? 'matter-orange' : 'matter-blue'}/30 rounded-full animate-spin-reverse-slow`}></div>

                        <img 
                            src={`https://picsum.photos/seed/${result.productName.replace(/\s/g,'')}/600/600`}
                            alt="Blueprint"
                            className={`w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(${isIndustrial ? '249,115,22' : '59,130,246'},0.5)] opacity-90`}
                        />
                        
                        {/* Scanning Laser */}
                        <div className={`absolute top-0 left-0 w-full h-0.5 bg-${isIndustrial ? 'matter-orange' : 'matter-blue'} shadow-[0_0_20px_rgba(${isIndustrial ? '249,115,22' : '59,130,246'},0.8)] animate-scan z-20`}></div>

                        {/* Interactive Data Points (Simulated) */}
                        <div className="absolute top-[30%] left-[20%] z-30 group-hover:opacity-100 opacity-60 transition-opacity">
                            <div className={`h-2 w-2 rounded-full ${bgColor} animate-pulse`}></div>
                            <div className="absolute left-4 top-0 bg-black/70 px-2 py-0.5 text-[8px] font-mono border border-white/10 whitespace-nowrap hidden group-hover:block text-white">
                                Motor Assembly
                            </div>
                        </div>
                         <div className="absolute bottom-[40%] right-[25%] z-30 group-hover:opacity-100 opacity-60 transition-opacity delay-100">
                            <div className={`h-2 w-2 rounded-full ${bgColor} animate-pulse`}></div>
                            <div className="absolute right-4 top-0 bg-black/70 px-2 py-0.5 text-[8px] font-mono border border-white/10 whitespace-nowrap hidden group-hover:block text-white">
                                MCU Core
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* HUD Overlays */}
                 <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className={`border-l-2 border-t-2 ${borderColor} w-8 h-8 rounded-tl-lg opacity-50`}></div>
                        <div className={`border-r-2 border-t-2 ${borderColor} w-8 h-8 rounded-tr-lg opacity-50`}></div>
                    </div>
                    
                    {/* Top Right Stats */}
                    <div className="absolute top-4 right-14 text-right">
                         <div className={`flex items-center justify-end gap-2 text-[10px] font-mono ${themeColor} animate-pulse`}>
                            <Target className="w-3 h-3" /> LIVE_RENDER
                         </div>
                         <div className="text-[9px] font-mono text-slate-500 mt-0.5">Scale: 1:1.5</div>
                    </div>

                    {/* Bottom Left Stats */}
                    <div className="absolute bottom-4 left-14">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                            <Aperture className={`w-3 h-3 ${themeColor} animate-spin-slow`} /> 
                            <span>ISO 400</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className={`border-l-2 border-b-2 ${borderColor} w-8 h-8 rounded-bl-lg opacity-50`}></div>
                        <div className="text-right">
                             <div className={`text-[10px] font-bold font-mono ${themeColor} tracking-widest bg-black/80 px-3 py-1 border ${borderColor} mb-1 flex items-center gap-2`}>
                                 <Scan className="w-3 h-3" /> SCHEMATIC
                             </div>
                             <div className={`border-r-2 border-b-2 ${borderColor} w-8 h-8 rounded-br-lg ml-auto opacity-50`}></div>
                        </div>
                    </div>
                    
                    {/* Center Crosshair */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20 group-hover:opacity-50 transition-opacity">
                         <div className={`absolute top-1/2 left-0 w-full h-[1px] ${bgColor}`}></div>
                         <div className={`absolute top-0 left-1/2 h-full w-[1px] ${bgColor}`}></div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Bill of Materials (BOM) with Reasoning */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-xl font-bold text-white font-mono uppercase">Tailored Bill of Materials</h4>
                 <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${themeColor}`} />
                    <div className="text-xs text-slate-400 font-mono">Market Price Optimized</div>
                 </div>
              </div>
              <div className="overflow-hidden border border-matter-border bg-matter-surface/50 rounded-lg">
                <table className="min-w-full divide-y divide-matter-border">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Component</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Spec</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Why we chose this</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Est. Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-matter-border">
                    {result.components.map((comp, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-white">{comp.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{comp.specs}</td>
                        <td className={`px-6 py-4 text-xs font-mono ${themeColor} border-l border-white/5 italic max-w-xs break-words`}>
                            "{comp.reason}"
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-white font-mono">₹{comp.cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* The Builder's Dilemma */}
            <h4 className="text-xl font-bold text-white font-mono uppercase mb-6 text-center">Select Your Path</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Path A: The Maker's Kit */}
              <div className={`group relative overflow-hidden bg-matter-surface border border-matter-border hover:border-${isIndustrial ? 'matter-orange' : 'matter-blue'} transition-all duration-300 p-8 flex flex-col rounded-sm`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Hammer className="h-32 w-32 text-white" />
                </div>
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 bg-slate-800 flex items-center justify-center rounded-sm text-slate-300 border border-slate-700">
                      <span className="font-mono font-bold">A</span>
                   </div>
                   <h3 className="text-2xl font-bold text-white uppercase tracking-tight">The Maker's Kit</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 flex-grow leading-relaxed">
                   We consolidate all raw components tailored to your <strong>{result.complexityTier.replace(/_/g, ' ').replace('TIER ', 'Tier ')}</strong> needs.
                </p>
                <div className="mb-6">
                     <div className={`text-xs font-bold ${themeColor} mb-2`}>Total Savings: ₹{result.totalSavings.toFixed(0)}</div>
                </div>

                {/* Adaptive Guide Preview */}
                <div className="bg-black/30 rounded-lg border border-white/5 p-4 mb-6">
                   <div className="flex items-center justify-between mb-3">
                      <h5 className={`text-xs font-bold uppercase tracking-widest ${themeColor} flex items-center gap-2`}>
                           <BookOpen className="w-3 h-3" /> Adaptive Build Guide
                      </h5>
                      <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded">
                         Complexity: {result.complexityTier === 'TIER_1_HOBBY' ? 'Beginner' : result.complexityTier === 'TIER_2_MAKER' ? 'Intermediate' : 'Expert'}
                      </span>
                   </div>
                   <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      {result.assemblySteps.map((step, i) => (
                           <div key={i} className="flex gap-3">
                              <span className={`font-mono text-xs font-bold ${themeColor} mt-0.5 opacity-70`}>{(i+1).toString().padStart(2, '0')}</span>
                              <p className="text-xs text-slate-300 leading-relaxed font-light">{step}</p>
                           </div>
                      ))}
                   </div>
                   <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 italic">
                      * Includes detailed safety protocols & schematics in app.
                   </div>
                </div>

                <div className="flex items-center justify-between border-t border-matter-border pt-6 mt-auto">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Aggregated Cost</p>
                    <p className="text-3xl font-bold text-white font-mono">₹{result.diyPrice.toFixed(0)}</p>
                  </div>
                  <button 
                    onClick={() => handleAddToCart('DIY_KIT')}
                    className="bg-white text-matter-dark hover:bg-slate-200 px-6 py-3 font-bold text-sm uppercase tracking-wide transition-colors flex items-center gap-2"
                  >
                    Select Kit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Path B: Assembled Masterpiece */}
              <div className={`group relative overflow-hidden bg-gradient-to-br from-matter-surface to-black border border-matter-border hover:${borderColor} hover:${glowShadow} transition-all duration-300 p-8 flex flex-col rounded-sm`}>
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Box className={`h-32 w-32 ${themeColor}`} />
                </div>
                <div className="flex items-center gap-3 mb-6">
                   <div className={`h-10 w-10 ${bgColor} bg-opacity-20 flex items-center justify-center rounded-sm ${themeColor} border ${borderColor} border-opacity-50`}>
                      <span className="font-mono font-bold">B</span>
                   </div>
                   <h3 className="text-2xl font-bold text-white uppercase tracking-tight">The Masterpiece</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                   Skip the soldering. Our engineers build it for you with {result.complexityTier === 'TIER_3_INDUSTRIAL' ? 'industrial precision' : 'care'}.
                </p>
                <div className="mb-8 flex items-center gap-2 text-xs text-green-400 bg-green-400/10 w-fit px-3 py-1 rounded-full border border-green-400/20">
                    <CheckCircle className="w-3 h-3" />
                    <span>Quality Tested + Warranty</span>
                </div>
                <div className="flex items-center justify-between border-t border-matter-border pt-6 mt-auto">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Service Cost</p>
                    <p className={`text-3xl font-bold ${themeColor} font-mono`}>₹{result.assembledPrice.toFixed(0)}</p>
                  </div>
                  <button 
                    onClick={() => handleAddToCart('ASSEMBLED')}
                    className={`${bgColor} text-white px-6 py-3 font-bold text-sm uppercase tracking-wide transition-colors flex items-center gap-2 hover:bg-opacity-80`}
                  >
                    Order Build <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILab;