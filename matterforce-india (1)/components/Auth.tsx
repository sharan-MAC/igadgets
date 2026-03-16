import React, { useState } from 'react';
import { Hexagon, Github, User as UserIcon } from 'lucide-react';

interface AuthProps {
  onLogin: (data: { name?: string; email: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
        if (!isLogin && !name) return; // Require name for signup

        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            onLogin({ 
                email, 
                name: isLogin ? undefined : name 
            });
            setIsLoading(false);
        }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-matter-dark flex flex-col items-center justify-center p-4 font-sans text-white relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-matter-blue via-matter-orange to-matter-blue opacity-50"></div>
       <div className="absolute -top-40 -right-40 w-96 h-96 bg-matter-orange/10 rounded-full blur-3xl"></div>
       <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-matter-blue/10 rounded-full blur-3xl"></div>

       {/* Container */}
       <div className="w-full max-w-[360px] flex flex-col items-center z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Logo */}
          <div className="mb-10 flex flex-col items-center gap-4">
             <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-matter-surface text-matter-orange ring-1 ring-matter-border shadow-2xl">
                <Hexagon className="h-8 w-8" strokeWidth={2.5} />
             </div>
             <h1 className="text-2xl font-bold font-mono tracking-tight text-center">MatterForce</h1>
          </div>

          {/* Form Card */}
          <div className="w-full space-y-6">
             <div className="text-center space-y-1 mb-8">
                <h2 className="text-2xl font-bold">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-slate-500 text-sm">
                   {isLogin ? 'Enter your credentials to access the Foundry.' : 'Join the new era of hardware engineering.'}
                </p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-matter-surface border border-matter-border rounded-lg px-4 py-3 text-sm text-white focus:border-matter-orange focus:ring-1 focus:ring-matter-orange outline-none transition-all placeholder:text-slate-500"
                            required
                        />
                    </div>
                )}
                <div className="space-y-3">
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-matter-surface border border-matter-border rounded-lg px-4 py-3 text-sm text-white focus:border-matter-orange focus:ring-1 focus:ring-matter-orange outline-none transition-all placeholder:text-slate-500"
                        required
                    />
                     <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-matter-surface border border-matter-border rounded-lg px-4 py-3 text-sm text-white focus:border-matter-orange focus:ring-1 focus:ring-matter-orange outline-none transition-all placeholder:text-slate-500"
                        required
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-matter-orange text-black font-bold py-3 rounded-lg hover:bg-matter-neon-orange transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        isLogin ? 'Continue' : 'Sign Up'
                    )}
                </button>
             </form>

             <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-matter-border"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-slate-500 font-mono">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-matter-border"></div>
             </div>

             <div className="space-y-3">
                 <button 
                    type="button"
                    onClick={() => onLogin({ email: 'demo@matterforce.in', name: 'Demo Maker' })}
                    className="w-full bg-matter-surface border border-matter-border text-white font-medium py-2.5 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-3 text-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Google
                 </button>
                 <button 
                    type="button"
                    onClick={() => onLogin({ email: 'demo@matterforce.in', name: 'Demo Maker' })}
                    className="w-full bg-matter-surface border border-matter-border text-white font-medium py-2.5 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-3 text-sm"
                >
                    <Github className="w-5 h-5" />
                    GitHub
                 </button>
             </div>

             <div className="text-center text-sm text-slate-500 pt-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-matter-orange hover:underline font-medium"
                >
                    {isLogin ? 'Sign up' : 'Log in'}
                </button>
             </div>
          </div>

          <div className="mt-12 text-center max-w-xs">
             <p className="text-[10px] text-slate-600">
                By continuing, you agree to MatterForce's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
             </p>
          </div>
       </div>
    </div>
  );
};

export default Auth;