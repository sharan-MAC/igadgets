import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowRight, Truck, Plus, Minus, CreditCard, Banknote, CheckCircle, FileText, X, BookOpen, PenTool, Share2, Link as LinkIcon, Copy, Package, Clock, Map, Radio, XCircle } from 'lucide-react';
import { CartItem, UserProfile, Order } from '../types';

interface CartProps {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  user: UserProfile | null;
  updateUser: (data: Partial<UserProfile>) => void;
}

const Cart: React.FC<CartProps> = ({ cart, removeFromCart, updateQuantity, clearCart, user, updateUser }) => {
  // Initialize step from localStorage or default to 'REVIEW'
  const [step, setStep] = useState<'REVIEW' | 'ADDRESS' | 'PAYMENT' | 'SUCCESS'>(() => {
    try {
      const savedStep = localStorage.getItem('mf_cart_step');
      return (savedStep as 'REVIEW' | 'ADDRESS' | 'PAYMENT' | 'SUCCESS') || 'REVIEW';
    } catch {
      return 'REVIEW';
    }
  });

  const [selectedBlueprint, setSelectedBlueprint] = useState<{name: string, steps: string[]} | null>(null);
  const [sharingItem, setSharingItem] = useState<CartItem | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Persisted Order Data for the Success Screen
  const [orderData, setOrderData] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('mf_order_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  // Initialize address. If user has a profile address, prioritize that.
  const [address, setAddress] = useState(() => {
    if (user && user.workshopAddress && user.workshopAddress.city) {
        return user.workshopAddress;
    }
    try {
      const savedAddress = localStorage.getItem('mf_cart_address');
      return savedAddress ? JSON.parse(savedAddress) : {
        houseNo: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        pincode: ''
      };
    } catch {
      return {
        houseNo: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        pincode: ''
      };
    }
  });

  // Persist step changes
  useEffect(() => {
    localStorage.setItem('mf_cart_step', step);
  }, [step]);

  // Persist address changes locally
  useEffect(() => {
    localStorage.setItem('mf_cart_address', JSON.stringify(address));
  }, [address]);

  // Reset copied state when modal closes or item changes
  useEffect(() => {
    setCopied(false);
  }, [sharingItem]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 1500 ? 0 : 99; // Free shipping over 1500 INR
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (step === 'REVIEW') setStep('ADDRESS');
    else if (step === 'ADDRESS') {
      // Basic validation
      if(!address.pincode || !address.city) return;
      
      // SAVE ADDRESS TO USER PROFILE
      if (user) {
          updateUser({ workshopAddress: address });
      }

      setStep('PAYMENT');
    }
    else if (step === 'PAYMENT') {
        // Generate Order Data
        const newOrder: Order = {
            id: `MF-IN-${Math.floor(Math.random() * 10000)}`,
            trackingId: `BD-${Math.floor(Math.random() * 10000000)}`,
            date: new Date().toISOString(),
            total: total,
            status: 'Processing',
            items: [...cart]
        };
        
        // Save to Local State for Success Screen
        setOrderData(newOrder);
        localStorage.setItem('mf_order_data', JSON.stringify(newOrder));

        // Save to History Array
        try {
            const history: Order[] = JSON.parse(localStorage.getItem('mf_orders_history') || '[]');
            history.unshift(newOrder);
            localStorage.setItem('mf_orders_history', JSON.stringify(history));
        } catch (e) {
            console.error("Failed to update order history", e);
        }
        
        clearCart();
        setStep('SUCCESS');
    }
  };

  const handleCancelSuccessOrder = () => {
    if (!orderData) return;
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;

    const updatedOrder: Order = { ...orderData, status: 'Cancelled' };
    setOrderData(updatedOrder);
    localStorage.setItem('mf_order_data', JSON.stringify(updatedOrder));

    // Update history
    try {
        const history: Order[] = JSON.parse(localStorage.getItem('mf_orders_history') || '[]');
        const updatedHistory = history.map(o => o.id === updatedOrder.id ? updatedOrder : o);
        localStorage.setItem('mf_orders_history', JSON.stringify(updatedHistory));
    } catch (e) {
        console.error("Failed to update order history", e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (cart.length === 0 && step !== 'SUCCESS') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center bg-matter-dark font-sans">
        <div className="rounded-full bg-matter-surface border border-matter-border p-6 mb-4">
          <ShoppingBag className="h-12 w-12 text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-white font-mono uppercase">Supply Chain Empty</h2>
        <p className="mt-2 text-slate-400">Initialize a project in The Foundry or source parts in The Bazaar.</p>
      </div>
    );
  }

  if (step === 'SUCCESS' && orderData) {
    const deliveryDate = new Date(orderData.date);
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const isCancelled = orderData.status === 'Cancelled';

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 bg-matter-dark font-sans animate-in fade-in duration-500">
            <div className={`rounded-full p-6 mb-6 border shadow-[0_0_20px_rgba(0,0,0,0.2)] ${isCancelled ? 'bg-red-900/20 border-red-500/50 shadow-red-500/20' : 'bg-green-900/20 border-green-500/50 shadow-green-500/20'}`}>
                {isCancelled ? <XCircle className="h-16 w-16 text-red-500" /> : <CheckCircle className="h-16 w-16 text-green-500" />}
            </div>
            <h2 className="text-3xl font-bold text-white font-mono uppercase mb-2 text-center">
                {isCancelled ? 'Order Cancelled' : 'Order Confirmed'}
            </h2>
            <p className="text-slate-400 mb-8 max-w-md text-center">
                {isCancelled 
                    ? <span>Your order <span className="text-matter-orange font-mono">#{orderData.id}</span> has been cancelled.</span>
                    : <span>Your Hardware Intelligence Order <span className="text-matter-orange font-mono">#{orderData.id}</span> has been dispatched to the logistics network.</span>
                }
            </p>
            
            {/* Live Map Visualization Section - Hide if cancelled */}
            {!isCancelled && (
                <div className="w-full max-w-lg mb-8 bg-black rounded-lg border border-matter-border overflow-hidden relative group shadow-2xl">
                    <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur px-3 py-1 rounded border border-matter-blue/30 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-white tracking-wider uppercase flex items-center gap-2">
                            Live Telemetry
                        </span>
                    </div>
                    
                    <div className="h-48 w-full bg-slate-950 relative overflow-hidden">
                        {/* Abstract Map Grid */}
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                        
                        {/* Path Line */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                             <path d="M 50 150 Q 250 50 450 100" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse opacity-50" />
                        </svg>

                        {/* Origin Point (Foundry) */}
                        <div className="absolute left-[50px] top-[150px] transform -translate-x-1/2 -translate-y-1/2">
                             <div className="w-3 h-3 bg-matter-orange rounded-full shadow-[0_0_15px_rgba(249,115,22,1)]"></div>
                             <div className="mt-2 text-[8px] uppercase text-matter-orange font-mono text-center bg-black/50 px-1 rounded">The Foundry</div>
                        </div>
                        
                        {/* Moving Drone/Package Icon */}
                        <div className="absolute left-[30%] top-[90px] transform -translate-x-1/2 -translate-y-1/2 animate-[pulse_4s_infinite]">
                             <div className="bg-matter-blue text-black p-1.5 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] z-10 relative">
                                <Truck className="w-4 h-4" />
                             </div>
                             {/* Ping effect for drone */}
                             <div className="absolute top-0 left-0 w-full h-full bg-matter-blue rounded-full animate-ping opacity-75"></div>
                        </div>
                    </div>

                    <div className="p-4 bg-matter-surface border-t border-matter-border flex justify-between items-center">
                         <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                <Map className="w-3 h-3" /> Current Location
                            </p>
                            <p className="text-sm font-bold text-white font-mono mt-0.5">Bangalore Gateway Hub</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-end gap-1.5">
                                <Radio className="w-3 h-3" /> Distance
                            </p>
                            <p className="text-sm font-bold text-matter-blue font-mono mt-0.5">12.4 km</p>
                         </div>
                    </div>
                </div>
            )}
            
            {/* Tracking Card */}
            <div className={`w-full max-w-lg bg-matter-surface border ${isCancelled ? 'border-red-900/30' : 'border-matter-border'} rounded-lg overflow-hidden mb-8 relative group`}>
                {/* Scanner Line Animation - Hide if cancelled */}
                {!isCancelled && <div className="absolute top-0 left-0 w-full h-1 bg-matter-blue/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-scan opacity-20 pointer-events-none"></div>}

                <div className="bg-black/40 p-4 border-b border-matter-border flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Truck className={`w-4 h-4 ${isCancelled ? 'text-slate-500' : 'text-matter-blue'}`} /> Logistics Status
                    </h3>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isCancelled ? 'text-red-500 bg-red-900/20 border-red-900/50' : 'text-matter-blue bg-matter-blue/10 border-matter-blue/20 animate-pulse'}`}>
                        {orderData.status.toUpperCase()}
                    </span>
                </div>
            
                <div className={`p-6 ${isCancelled ? 'opacity-50 grayscale' : ''}`}>
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Package className="w-3 h-3" /> Carrier</p>
                            <p className="text-sm font-bold text-white">BlueDart Express</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tracking ID</p>
                            <p className="text-sm font-mono text-slate-300">{orderData.trackingId}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Est. Delivery</p>
                            <p className="text-sm font-bold text-white">
                                {deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Weight</p>
                            <p className="text-sm font-mono text-slate-300">2.4 kg</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Recipient</p>
                            <p className="text-sm font-mono text-slate-300">{user?.name || 'Valued Maker'}</p>
                        </div>
                    </div>

                    {/* Visual Timeline */}
                    <div className="relative border-l border-matter-border ml-1.5 space-y-6 pb-2">
                        {/* Step 1 */}
                        <div className="pl-6 relative">
                            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-matter-blue border border-black shadow-[0_0_8px_rgba(59,130,246,0.6)] z-10"></div>
                            <p className="text-xs font-bold text-white">Order Confirmed</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Just now</p>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="pl-6 relative">
                            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-matter-surface border border-matter-border z-10"></div>
                            <p className="text-xs font-medium text-slate-500">Processing at Foundry</p>
                        </div>

                        {/* Step 3 */}
                        <div className="pl-6 relative">
                            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-matter-surface border border-matter-border z-10"></div>
                            <p className="text-xs font-medium text-slate-500">Quality Check</p>
                        </div>

                        {/* Step 4 */}
                        <div className="pl-6 relative">
                            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-matter-surface border border-matter-border z-10"></div>
                            <p className="text-xs font-medium text-slate-500">Out for Delivery</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 items-center w-full max-w-lg">
                {!isCancelled && (
                    <button 
                        onClick={handleCancelSuccessOrder}
                        className="w-full border border-red-500/30 text-red-500 hover:bg-red-950/30 py-3 rounded text-sm font-bold uppercase tracking-wider transition-all"
                    >
                        Cancel Delivery
                    </button>
                )}

                <button 
                    onClick={() => {
                        setStep('REVIEW');
                        localStorage.setItem('mf_cart_step', 'REVIEW');
                        setOrderData(null);
                        localStorage.removeItem('mf_order_data');
                    }}
                    className="text-xs text-slate-500 hover:text-white underline underline-offset-4 uppercase tracking-widest transition-colors"
                >
                    Initialize New Project
                </button>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-matter-dark pb-20 font-sans relative">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-8 font-mono uppercase border-b border-matter-border pb-4">
           {step === 'REVIEW' && 'Cart Review'}
           {step === 'ADDRESS' && 'Logistics Details'}
           {step === 'PAYMENT' && 'Secure Payment'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-8">
            
            {step === 'REVIEW' && (
                <ul className="divide-y divide-matter-border rounded-sm bg-matter-surface border border-matter-border overflow-hidden">
                {cart.map((item) => (
                    <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 group hover:bg-white/5 transition-colors">
                    {/* Image/Icon */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-black border border-matter-border">
                        <img 
                        src={item.image || "https://picsum.photos/200/200"} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-base font-bold text-white uppercase tracking-tight">{item.name}</h3>
                            <p className="font-mono text-sm font-medium text-matter-orange ml-4">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-400 line-clamp-1">{item.details}</p>
                        
                        {/* Type Badge & Blueprint Button */}
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                             <span className={`px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider
                                ${item.type === 'DIY_KIT' ? 'bg-matter-orange/10 border-matter-orange text-matter-orange' : 
                                item.type === 'ASSEMBLED' ? 'bg-purple-900/20 border-purple-500 text-purple-400' : 
                                'bg-slate-800 border-slate-600 text-slate-300'}`}>
                                {item.type.replace('_', ' ')}
                            </span>
                            
                            {item.type === 'DIY_KIT' && item.assemblyGuide && (
                                <button
                                    onClick={() => setSelectedBlueprint({name: item.name, steps: item.assemblyGuide!})}
                                    className="text-xs font-bold bg-matter-blue text-black hover:bg-white hover:text-black flex items-center gap-2 px-3 py-1.5 rounded transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    View Blueprint
                                </button>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-matter-border bg-black">
                                <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-3 py-1 text-slate-400 hover:text-white transition-colors border-r border-matter-border"
                                >
                                <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 text-sm text-white font-mono min-w-[2rem] text-center">{item.quantity}</span>
                                <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-3 py-1 text-slate-400 hover:text-white transition-colors border-l border-matter-border"
                                >
                                <Plus className="h-3 w-3" />
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => setSharingItem(item)}
                                className="h-8 w-8 flex items-center justify-center border border-matter-border bg-black text-slate-400 hover:text-matter-blue hover:border-matter-blue transition-all duration-300 rounded-sm"
                                title="Share Configuration"
                            >
                                <Share2 className="h-4 w-4" />
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm font-medium text-red-500/70 hover:text-red-500 transition-colors flex items-center gap-1.5"
                        >
                            <Trash2 className="h-4 w-4" /> 
                            <span className="hidden sm:inline">Remove</span>
                        </button>
                        </div>
                    </div>
                    </li>
                ))}
                </ul>
            )}

            {step === 'ADDRESS' && (
                <div className="bg-matter-surface border border-matter-border p-6 rounded-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="md:col-span-2">
                             <label className="block text-xs font-mono text-slate-500 uppercase mb-1">House No. / Flat</label>
                             <input type="text" className="w-full bg-black border border-matter-border p-2 text-white focus:border-matter-orange outline-none" 
                                value={address.houseNo} onChange={e => setAddress({...address, houseNo: e.target.value})} />
                         </div>
                         <div className="md:col-span-2">
                             <label className="block text-xs font-mono text-slate-500 uppercase mb-1">Street / Area</label>
                             <input type="text" className="w-full bg-black border border-matter-border p-2 text-white focus:border-matter-orange outline-none"
                             value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                         </div>
                         <div>
                             <label className="block text-xs font-mono text-slate-500 uppercase mb-1">Landmark</label>
                             <input type="text" className="w-full bg-black border border-matter-border p-2 text-white focus:border-matter-orange outline-none"
                             value={address.landmark} onChange={e => setAddress({...address, landmark: e.target.value})} />
                         </div>
                         <div>
                             <label className="block text-xs font-mono text-slate-500 uppercase mb-1">City</label>
                             <input type="text" className="w-full bg-black border border-matter-border p-2 text-white focus:border-matter-orange outline-none"
                             value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                         </div>
                         <div>
                             <label className="block text-xs font-mono text-slate-500 uppercase mb-1">State</label>
                             <select className="w-full bg-black border border-matter-border p-2 text-white focus:border-matter-orange outline-none"
                             value={address.state} onChange={e => setAddress({...address, state: e.target.value})}>
                                 <option value="">Select State</option>
                                 <option value="MH">Maharashtra</option>
                                 <option value="DL">Delhi</option>
                                 <option value="KA">Karnataka</option>
                                 <option value="TN">Tamil Nadu</option>
                             </select>
                         </div>
                         <div>
                             <label className="block text-xs font-mono text-slate-500 uppercase mb-1">Pincode</label>
                             <input type="text" maxLength={6} className="w-full bg-black border border-matter-border p-2 text-white focus:border-matter-orange outline-none"
                             value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                         </div>
                    </div>
                </div>
            )}

            {step === 'PAYMENT' && (
                <div className="space-y-4">
                    <div className="bg-matter-surface border border-matter-border p-6 rounded-sm flex items-center justify-between cursor-pointer hover:border-matter-orange transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-matter-orange/10 rounded flex items-center justify-center text-matter-orange group-hover:bg-matter-orange group-hover:text-black transition-colors">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">UPI / QR Code</h4>
                                <p className="text-xs text-slate-500">GPay, PhonePe, Paytm</p>
                            </div>
                        </div>
                        <input type="radio" name="payment" className="accent-matter-orange h-5 w-5" defaultChecked />
                    </div>

                    <div className="bg-matter-surface border border-matter-border p-6 rounded-sm flex items-center justify-between cursor-pointer hover:border-matter-orange transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-800 rounded flex items-center justify-center text-slate-400 group-hover:bg-slate-700 transition-colors">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Cash on Delivery</h4>
                                <p className="text-xs text-slate-500">Pay upon receipt</p>
                            </div>
                        </div>
                        <input type="radio" name="payment" className="accent-matter-orange h-5 w-5" />
                    </div>
                </div>
            )}

          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-matter-surface border border-matter-border p-6 shadow-xl shadow-black/20">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Cost Breakdown</h3>
               
               <div className="space-y-4 border-b border-matter-border pb-6">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Logistics (India)</span>
                    <span className="text-white font-mono">
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">GST (18%)</span>
                    <span className="text-white font-mono">Included</span>
                 </div>
               </div>

               <div className="mt-6 flex items-center justify-between">
                  <span className="text-base font-bold text-white uppercase">Total</span>
                  <span className="text-xl font-bold text-matter-orange font-mono">₹{total.toLocaleString('en-IN')}</span>
               </div>

               <button 
                 onClick={handleCheckout}
                 className="mt-8 w-full bg-matter-orange px-4 py-3 text-sm font-bold text-black uppercase tracking-wide hover:bg-matter-neon transition-all flex items-center justify-center gap-2"
               >
                 {step === 'PAYMENT' ? 'Confirm Order' : 'Proceed'} <ArrowRight className="h-4 w-4" />
               </button>
               
               <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
                  <Truck className="h-3 w-3" />
                  <span>Free shipping &gt; ₹1,500</span>
               </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Blueprint Modal */}
      {selectedBlueprint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-matter-surface border border-matter-border w-full max-w-lg rounded-lg shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]">
                  
                  {/* Modal Header */}
                  <div className="p-4 border-b border-matter-border bg-black/80 flex justify-between items-center sticky top-0 z-10">
                      <div className="flex items-center gap-3 overflow-hidden">
                          <div className="bg-matter-blue/10 p-2 rounded border border-matter-blue/30 text-matter-blue">
                              <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                              <h3 className="text-sm font-bold text-white font-mono uppercase truncate">Engineering Blueprint</h3>
                              <p className="text-xs text-slate-400 truncate max-w-[200px]">{selectedBlueprint.name}</p>
                          </div>
                      </div>
                      <button onClick={() => setSelectedBlueprint(null)} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded">
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 overflow-y-auto bg-black/40">
                      <div className="mb-6 flex items-center gap-2 text-xs text-slate-500 font-mono border-b border-matter-border pb-2">
                         <PenTool className="w-3 h-3" />
                         <span>ASSEMBLY_SEQUENCE_V1.0</span>
                      </div>

                      <div className="space-y-6">
                          {selectedBlueprint.steps.map((step, i) => (
                              <div key={i} className="flex gap-4 group">
                                  <div className="flex flex-col items-center">
                                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-matter-blue/10 text-matter-blue border border-matter-blue/30 flex items-center justify-center text-sm font-mono font-bold group-hover:bg-matter-blue group-hover:text-black transition-colors">
                                          {i + 1}
                                      </span>
                                      {i !== selectedBlueprint.steps.length - 1 && (
                                          <div className="w-px h-full bg-matter-border my-2 group-hover:bg-matter-blue/30 transition-colors"></div>
                                      )}
                                  </div>
                                  <div className="pt-1 pb-4">
                                      <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors font-light">{step}</p>
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Footer */}
                      <div className="mt-8 pt-6 border-t border-matter-border text-center">
                          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                             <CheckCircle className="w-3 h-3 text-green-500" />
                             --- End of Engineering Procedure ---
                          </p>
                      </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="p-4 border-t border-matter-border bg-black/80 text-right sticky bottom-0 z-10">
                       <button onClick={() => setSelectedBlueprint(null)} className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors">
                           Close Blueprint
                       </button>
                  </div>
              </div>
          </div>
      )}

      {/* Share Modal */}
      {sharingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-matter-surface border border-matter-border w-full max-w-md rounded-lg shadow-2xl overflow-hidden relative flex flex-col">
                  
                  {/* Modal Header */}
                  <div className="p-4 border-b border-matter-border bg-black/80 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-matter-orange" />
                          Share Intelligence
                      </h3>
                      <button onClick={() => setSharingItem(null)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  <div className="p-6 space-y-6">
                      
                      {/* Item Preview */}
                      <div className="flex gap-4 p-3 border border-matter-border bg-black/40 rounded-sm">
                          <div className="h-12 w-12 bg-black flex-shrink-0 border border-matter-border">
                              <img src={sharingItem.image} alt={sharingItem.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                              <h4 className="text-sm font-bold text-white truncate">{sharingItem.name}</h4>
                              <p className="text-xs text-matter-orange font-mono">₹{sharingItem.price.toLocaleString('en-IN')}</p>
                          </div>
                      </div>

                      {/* Link Generator */}
                      <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Generated Deep Link</label>
                          <div className="flex">
                              <div className="bg-black border border-matter-border border-r-0 text-slate-400 text-xs font-mono p-3 flex-1 flex items-center gap-2 overflow-hidden whitespace-nowrap">
                                  <LinkIcon className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">matterforce.in/build/{sharingItem.id}</span>
                              </div>
                              <button 
                                  onClick={() => copyToClipboard(`https://matterforce.in/build/${sharingItem.id}`)}
                                  className="bg-white text-black px-4 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center gap-2"
                              >
                                  {copied ? <CheckCircle className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                  {copied ? 'Copied' : 'Copy'}
                              </button>
                          </div>
                      </div>

                      {/* Social Actions */}
                      <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=Building ${sharingItem.name} with MatterForce India. Adaptive hardware intelligence.&url=https://matterforce.in/build/${sharingItem.id}`, '_blank')}
                            className="flex items-center justify-center gap-2 border border-matter-border bg-matter-surface hover:bg-white/5 hover:border-white/20 py-3 transition-all group"
                          >
                              <span className="text-xs font-bold text-slate-300 group-hover:text-white">X / Twitter</span>
                          </button>
                          <button 
                             onClick={() => window.open(`https://wa.me/?text=Check out this build on MatterForce: ${sharingItem.name} - https://matterforce.in/build/${sharingItem.id}`, '_blank')}
                             className="flex items-center justify-center gap-2 border border-matter-border bg-matter-surface hover:bg-white/5 hover:border-white/20 py-3 transition-all group"
                          >
                              <span className="text-xs font-bold text-slate-300 group-hover:text-white">WhatsApp</span>
                          </button>
                      </div>
                  </div>

              </div>
          </div>
      )}
    </div>
  );
};

export default Cart;