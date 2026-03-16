import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AILab from './components/AILab';
import Marketplace from './components/Marketplace';
import Cart from './components/Cart';
import Auth from './components/Auth';
import VeoSimulation from './components/VeoSimulation';
import { ViewState, CartItem, UserProfile, Order } from './types';
import { User, Settings, MapPin, LogOut, Package, Clock, ChevronRight, Truck, XCircle } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from history
    try {
        const history = JSON.parse(localStorage.getItem('mf_orders_history') || '[]');
        if (Array.isArray(history)) {
            setOrders(history);
        } else {
             // Fallback: Check if there is a single legacy order
             const legacyOrder = JSON.parse(localStorage.getItem('mf_order_data') || 'null');
             if (legacyOrder) {
                 setOrders([legacyOrder]);
             }
        }
    } catch (e) {
        setOrders([]);
    }
  }, []);

  const handleCancelOrder = (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;

    const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
            return { ...order, status: 'Cancelled' as const };
        }
        return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem('mf_orders_history', JSON.stringify(updatedOrders));
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Cancelled': return 'bg-red-900/30 text-red-400 border-red-900/50';
          case 'Delivered': return 'bg-green-900/30 text-green-400 border-green-900/50';
          case 'Shipped': return 'bg-matter-orange/10 text-matter-orange border-matter-orange/30';
          default: return 'bg-blue-900/30 text-blue-400 border-blue-900/50';
      }
  };

  return (
    <div className="min-h-screen bg-matter-dark flex justify-center text-white pb-20 font-sans pt-12 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Card (Left) */}
        <div className="md:col-span-4 lg:col-span-4">
            <div className="bg-matter-surface border border-matter-border p-8 text-center relative overflow-hidden rounded-lg shadow-2xl sticky top-24">
            {/* Decorative bg element */}
            <div className="absolute top-0 left-0 w-full h-1 bg-matter-orange"></div>
            
            <div className="h-24 w-24 mx-auto bg-black rounded-full flex items-center justify-center mb-6 border-2 border-matter-orange shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <User className="h-10 w-10 text-matter-orange" />
            </div>
            <h2 className="text-2xl font-bold font-mono uppercase tracking-tight">{user.name}</h2>
            <p className="text-slate-500 mt-2 text-sm font-mono">{user.email}</p>
            
            <div className="mt-8 space-y-4 text-left">
                <div className="p-4 bg-black border border-matter-border flex items-start gap-4 rounded-sm">
                    <MapPin className="w-5 h-5 text-matter-orange shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Workshop Base</h4>
                        {user.workshopAddress && user.workshopAddress.city ? (
                            <p className="text-xs text-slate-400 mt-1 font-mono">
                            {user.workshopAddress.houseNo}, {user.workshopAddress.street}<br/>
                            {user.workshopAddress.city}, {user.workshopAddress.state} {user.workshopAddress.pincode}
                            </p>
                        ) : (
                            <p className="text-xs text-slate-600 mt-1 font-mono italic">No workshop address configured.</p>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-black border border-matter-border flex items-start gap-4 rounded-sm">
                    <Settings className="w-5 h-5 text-matter-orange shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Configuration</h4>
                        <p className="text-xs text-slate-400 mt-1 font-mono">Currency: INR (₹) <br/> Pref: DIY Kits</p>
                    </div>
                </div>
            </div>

            <button 
                onClick={onLogout}
                className="mt-8 w-full flex items-center justify-center gap-2 border border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
            </div>
        </div>

        {/* Order History (Right) */}
        <div className="md:col-span-8 lg:col-span-8">
            <h3 className="text-xl font-bold text-white font-mono uppercase mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-matter-blue" /> Order History
            </h3>

            {orders.length === 0 ? (
                <div className="bg-matter-surface border border-matter-border border-dashed p-12 rounded-lg text-center flex flex-col items-center justify-center">
                    <Package className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-500 font-mono">No supply chain activity detected.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, idx) => {
                        const date = new Date(order.date);
                        const deliveryDate = new Date(date);
                        deliveryDate.setDate(date.getDate() + 4);
                        const isCancelled = order.status === 'Cancelled';

                        return (
                            <div key={idx} className={`bg-matter-surface border ${isCancelled ? 'border-red-900/30 opacity-75' : 'border-matter-border'} rounded-lg p-6 group hover:border-matter-blue transition-colors relative overflow-hidden`}>
                                {/* Status Line */}
                                <div className={`absolute top-0 left-0 w-1 h-full ${isCancelled ? 'bg-red-900' : 'bg-matter-blue'}`}></div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className={`text-lg font-bold font-mono ${isCancelled ? 'text-slate-400 line-through' : 'text-white'}`}>{order.id}</h4>
                                            <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider rounded ${getStatusColor(order.status)}`}>
                                                {order.status || 'Processing'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-mono">Placed on {date.toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-xl font-bold text-white font-mono">₹{order.total?.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                {/* Items Preview (if available) */}
                                {order.items && order.items.length > 0 && (
                                    <div className="mb-6 bg-black/40 border border-matter-border rounded p-4">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Manifest</p>
                                        <div className="flex flex-col gap-2">
                                            {order.items.slice(0, 2).map((item, i) => (
                                                <div key={i} className="flex justify-between items-center text-sm">
                                                    <span className={`text-slate-300 truncate pr-4 ${isCancelled ? 'line-through text-slate-600' : ''}`}>{item.quantity}x {item.name}</span>
                                                    <span className="text-slate-500 font-mono shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-xs text-slate-600 italic mt-1">+ {order.items.length - 2} more items</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-matter-border gap-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tracking ID</p>
                                            <p className={`text-sm font-mono tracking-wide ${isCancelled ? 'text-slate-600' : 'text-white'}`}>{order.trackingId}</p>
                                        </div>
                                        
                                        {!isCancelled && (
                                            <>
                                                <div className="h-8 w-px bg-matter-border mx-2 hidden sm:block"></div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> Est. Delivery
                                                    </p>
                                                    <p className="text-sm font-bold text-matter-blue">
                                                        {deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {order.status === 'Processing' && (
                                            <button 
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="text-xs font-bold uppercase tracking-wider text-red-500/70 hover:text-red-500 flex items-center gap-1 transition-colors border border-transparent hover:border-red-900/50 px-3 py-1.5 rounded"
                                            >
                                                <XCircle className="w-3 h-3" /> Cancel
                                            </button>
                                        )}
                                        
                                        {!isCancelled && (
                                            <button className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded hover:bg-white/5">
                                                Track <span className="hidden sm:inline">Shipment</span> <ChevronRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Load Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mf_auth') === 'true';
  });

  // Load User Profile Data from LocalStorage IF Authenticated
  const [user, setUser] = useState<UserProfile | null>(() => {
      const isAuth = localStorage.getItem('mf_auth') === 'true';
      if (!isAuth) return null;
      
      try {
        const savedUser = localStorage.getItem('mf_user');
        return savedUser ? JSON.parse(savedUser) : null;
      } catch {
        return null;
      }
  });

  const [currentView, setView] = useState<ViewState>('HOME');
  
  // Persist cart to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('mf_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('mf_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist Auth State
  useEffect(() => {
    localStorage.setItem('mf_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  // Persist User Profile Data whenever it is updated
  useEffect(() => {
    if (user) {
        localStorage.setItem('mf_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('mf_user');
    }
  }, [user]);

  const handleLogin = (data: { name?: string; email: string }) => {
    // Basic login logic. In a real app, this would validate credentials.
    // Here we just ensure we have a user object structure.
    if (!user) {
        const newUser: UserProfile = {
            name: data.name || data.email.split('@')[0],
            email: data.email,
            workshopAddress: {
                houseNo: '',
                street: '',
                landmark: '',
                city: '',
                state: '',
                pincode: ''
            }
        };
        setUser(newUser);
    } else if (user.email !== data.email) {
        // Switching users (mock scenario)
        const newUser: UserProfile = {
            name: data.name || data.email.split('@')[0],
            email: data.email,
            workshopAddress: {
                houseNo: '',
                street: '',
                landmark: '',
                city: '',
                state: '',
                pincode: ''
            }
        };
        setUser(newUser);
    }
    
    setIsAuthenticated(true);
    setView('HOME');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null); // This triggers the useEffect to remove mf_user from storage
    setView('HOME'); 
  };

  const updateUser = (updates: Partial<UserProfile>) => {
      setUser(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME': return <Hero setView={setView} />;
      case 'FOUNDRY': return <AILab addToCart={addToCart} />;
      case 'BAZAAR': return <Marketplace addToCart={addToCart} />;
      case 'SIMULATION': return <VeoSimulation />;
      case 'CART': return <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} clearCart={clearCart} user={user} updateUser={updateUser} />;
      case 'PROFILE': return user ? <Profile user={user} onLogout={handleLogout} /> : <div/>;
      default: return <Hero setView={setView} />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="bg-matter-dark min-h-screen text-slate-200 font-sans selection:bg-matter-orange selection:text-black">
      <Navbar currentView={currentView} setView={setView} cart={cart} />
      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default App;