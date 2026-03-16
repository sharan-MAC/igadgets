import React, { useState, useRef, useEffect } from 'react';
import { Upload, Clapperboard, MonitorPlay, AlertTriangle, Play, RefreshCw, X, Loader2, ScanLine, Film } from 'lucide-react';
import { generateVeoVideo } from '../services/geminiService';

const VeoSimulation: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [simulationStep, setSimulationStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isGenerating) return;
    const steps = [
      "Analyzing Visual Geometry...",
      "Mapping 3D Depth Field...",
      "Synthesizing Motion Vectors...",
      "Applying Physics Constraints...",
      "Rendering Video Stream..."
    ];
    let i = 0;
    setSimulationStep(steps[0]);
    const interval = setInterval(() => {
        i++;
        if (i < steps.length) {
            setSimulationStep(steps[i]);
        }
    }, 2500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please use an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove data URL prefix for API
        const base64String = reader.result as string;
        // Keep full string for display, extract raw base64 for API
        setImage(base64String);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRawBase64 = (dataUrl: string) => {
    return dataUrl.split(',')[1];
  };

  const handleGenerate = async () => {
    if (!image) return;

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const rawBase64 = getRawBase64(image);
      const url = await generateVeoVideo(rawBase64, prompt, aspectRatio);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Simulation failed. Please check your API key settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetSimulation = () => {
    setImage(null);
    setVideoUrl(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-matter-dark pb-20 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 border-l-4 border-matter-blue pl-4">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3 font-mono uppercase">
            Simulation Chamber
          </h2>
          <p className="mt-1 text-slate-400">Powered by Veo. Animate your schematics into reality.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls Panel */}
          <div className="bg-matter-surface border border-matter-border p-6 rounded-lg h-fit shadow-xl">
            
            {/* Image Upload Area */}
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-matter-border rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:border-matter-blue hover:bg-white/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-matter-border relative z-10">
                  <Upload className="h-8 w-8 text-slate-400 group-hover:text-matter-blue" />
                </div>
                <p className="text-slate-300 font-bold uppercase tracking-wide relative z-10">Upload Schematic / Photo</p>
                <p className="text-slate-500 text-xs mt-2 relative z-10">Supports JPG, PNG (Max 5MB)</p>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-matter-border mb-6 group bg-black">
                <img src={image} alt="Source" className="w-full h-64 object-contain opacity-80" />
                {/* Overlay Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-black/80 p-2 rounded text-white hover:text-red-500 transition-colors border border-white/10 z-20"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/90 px-2 py-1 rounded text-[10px] text-matter-blue font-mono border border-matter-blue/30 uppercase tracking-wider">
                  SOURCE_LOCKED
                </div>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-6 mt-6">
              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase mb-2 flex items-center gap-2">
                    <ScanLine className="w-3 h-3" /> Simulation Parameters
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the motion physics. e.g., 'The drone propellers spin rapidly and it lifts off vertically' or 'Camera pans 360 degrees around the component'"
                  className="w-full h-24 bg-black border border-matter-border p-4 text-white placeholder-slate-600 focus:outline-none focus:border-matter-blue resize-none rounded-sm font-sans text-sm"
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase mb-2">Viewport Ratio</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex items-center justify-center gap-2 py-3 border rounded-sm transition-all text-sm font-bold uppercase ${aspectRatio === '16:9' ? 'bg-matter-blue text-black border-matter-blue' : 'bg-black text-slate-400 border-matter-border hover:border-white'}`}
                    disabled={isGenerating}
                  >
                    <MonitorPlay className="w-4 h-4" /> 16:9 Landscape
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex items-center justify-center gap-2 py-3 border rounded-sm transition-all text-sm font-bold uppercase ${aspectRatio === '9:16' ? 'bg-matter-blue text-black border-matter-blue' : 'bg-black text-slate-400 border-matter-border hover:border-white'}`}
                    disabled={isGenerating}
                  >
                    <MonitorPlay className="w-4 h-4 rotate-90" /> 9:16 Portrait
                  </button>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!image || isGenerating}
                className={`w-full py-4 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 relative overflow-hidden group
                  ${!image || isGenerating 
                    ? 'bg-matter-border text-slate-500 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-matter-blue hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Rendering...
                  </>
                ) : (
                  <>
                    <Clapperboard className="w-4 h-4" /> Initialize Veo Engine
                  </>
                )}
                {/* Button Shine Effect */}
                {!isGenerating && image && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>}
              </button>
              
              {/* Billing Note */}
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-500 border-t border-matter-border pt-4">
                 <AlertTriangle className="w-3 h-3" />
                 <span>Requires Billing-Enabled API Key. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-white">Learn More</a></span>
              </div>
            </div>
          </div>

          {/* Viewport / Result */}
          <div className="relative min-h-[500px] bg-black border border-matter-border rounded-lg flex items-center justify-center overflow-hidden shadow-2xl">
             
             {/* Tech Grid Background */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

             {/* Error State */}
             {error && (
               <div className="text-center p-8 max-w-md relative z-20 bg-black/80 border border-red-900/50 rounded-lg backdrop-blur">
                 <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                 <h3 className="text-white font-bold mb-2">Simulation Failed</h3>
                 <p className="text-red-400 text-sm font-mono mb-4">{error}</p>
                 <button onClick={() => setError(null)} className="text-xs text-slate-500 uppercase underline hover:text-white">Dismiss Alert</button>
               </div>
             )}

             {/* Standby State */}
             {!videoUrl && !isGenerating && !error && (
               <div className="text-center opacity-30 flex flex-col items-center">
                 <div className="h-32 w-32 rounded-full border border-dashed border-slate-600 flex items-center justify-center mb-6 animate-spin-slow">
                     <Film className="w-12 h-12 text-slate-500" />
                 </div>
                 <h3 className="text-2xl font-bold font-mono uppercase tracking-widest text-slate-500">Viewport Offline</h3>
                 <p className="text-slate-600 text-xs mt-2 font-mono">Awaiting Input Data...</p>
               </div>
             )}

             {/* Generating State with Holographic Effect */}
             {isGenerating && image && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                   {/* Background Image Ghost */}
                   <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale blur-sm" alt="Processing" />
                   
                   {/* Scanning Laser */}
                   <div className="absolute top-0 left-0 w-full h-1 bg-matter-blue shadow-[0_0_30px_rgba(59,130,246,1)] animate-scan z-20"></div>

                   {/* Central Loader */}
                   <div className="relative z-30 bg-black/80 p-8 rounded-lg border border-matter-blue/30 backdrop-blur-md text-center max-w-sm w-full mx-4">
                       <div className="w-12 h-12 border-4 border-matter-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                       <h3 className="text-matter-blue font-bold font-mono animate-pulse text-lg">PROCESSING</h3>
                       <p className="text-white font-mono text-sm mt-2">{simulationStep}</p>
                       <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                           <div className="h-full bg-matter-blue animate-progress w-full origin-left" style={{ animationDuration: '3s' }}></div>
                       </div>
                   </div>
                </div>
             )}

             {/* Video Result */}
             {videoUrl && (
               <div className="relative w-full h-full flex items-center justify-center bg-black animate-in fade-in duration-1000">
                 <video 
                   src={videoUrl} 
                   controls 
                   autoPlay 
                   loop 
                   className={`max-h-full max-w-full shadow-[0_0_50px_rgba(59,130,246,0.1)] ${aspectRatio === '9:16' ? 'h-[500px]' : 'w-full'}`}
                 />
                 
                 {/* Success Badge */}
                 <div className="absolute top-4 left-4 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Simulation Active
                 </div>

                 <button 
                   onClick={resetSimulation}
                   className="absolute top-4 right-4 bg-black/80 hover:bg-white hover:text-black text-white p-2 rounded transition-colors z-20 border border-white/10"
                   title="New Simulation"
                 >
                    <RefreshCw className="w-4 h-4" />
                 </button>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VeoSimulation;