import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Star, ShieldCheck, Briefcase, GraduationCap, Check, Heart } from 'lucide-react';
import { MARKETPLACE_DATA } from '../constants';
import { StoreProduct, CartItem } from '../types';

interface MarketplaceProps {
  addToCart: (item: CartItem) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mf_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mf_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const categories = ['All', ...Array.from(new Set(MARKETPLACE_DATA.map(p => p.category)))];
  const grades = ['All', 'Hobby', 'Pro', 'Industrial'];

  const filteredProducts = MARKETPLACE_DATA.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesGrade = selectedGrade === 'All' || product.grade === selectedGrade;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  const handleAddToCart = (product: StoreProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      type: 'STORE_ITEM',
      price: product.price,
      quantity: 1,
      image: product.image,
      details: `${product.category} • ${product.grade} Grade`
    });

    // Trigger visual feedback animation
    setAddingId(product.id);
    setTimeout(() => setAddingId(null), 600);
  };

  return (
    <div className="min-h-screen bg-matter-dark pb-20 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-matter-border pb-6">
          <div className="border-l-4 border-white pl-4">
            <h2 className="text-3xl font-bold text-white font-mono uppercase">The Bazaar</h2>
            <p className="text-slate-400 text-sm mt-1">Direct-from-source components. Price transparency enabled.</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full rounded-sm border border-matter-border bg-matter-surface py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:border-matter-blue focus:outline-none focus:ring-1 focus:ring-matter-blue transition-all font-mono"
              placeholder="Search part no, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`whitespace-nowrap px-4 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all
                        ${selectedCategory === cat 
                            ? 'bg-white border-white text-black' 
                            : 'bg-transparent border-matter-border text-slate-400 hover:border-white hover:text-white'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

             {/* Grade Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-l border-matter-border pl-0 sm:pl-4">
                {grades.map((grade) => (
                    <button
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-1
                        ${selectedGrade === grade 
                            ? (grade === 'Hobby' ? 'bg-matter-blue border-matter-blue text-white' : grade === 'Industrial' ? 'bg-matter-orange border-matter-orange text-white' : 'bg-slate-700 border-slate-700 text-white')
                            : 'bg-transparent border-matter-border text-slate-400 hover:border-slate-500 hover:text-white'}`}
                    >
                        {grade === 'Hobby' && <GraduationCap className="w-3 h-3" />}
                        {grade === 'Industrial' && <Briefcase className="w-3 h-3" />}
                        {grade}
                    </button>
                ))}
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
             const gradeColor = product.grade === 'Hobby' ? 'text-matter-blue' : product.grade === 'Industrial' ? 'text-matter-orange' : 'text-slate-400';
             const isWishlisted = wishlist.includes(product.id);
             
             return (
            <div key={product.id} className="group relative flex flex-col overflow-hidden bg-matter-surface border border-matter-border hover:border-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50 hover:z-10">
              
              {/* Image */}
              <div className="aspect-square bg-black relative overflow-hidden border-b border-matter-border">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-2 left-2">
                   {product.bestVendor && (
                     <span className="flex items-center gap-1 bg-black/80 backdrop-blur px-2 py-1 text-[10px] text-white font-mono border border-white/20">
                        <ShieldCheck className="w-3 h-3 text-green-400" />
                        Best Price: {product.bestVendor}
                     </span>
                   )}
                </div>
                
                {/* Wishlist Button */}
                <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all z-10 group/btn"
                >
                    <Heart className={`w-4 h-4 transition-all ${isWishlisted ? 'fill-matter-orange text-matter-orange' : 'text-slate-300 group-hover/btn:text-white'}`} />
                </button>

                 <div className="absolute bottom-2 right-2">
                     <span className={`bg-black/90 backdrop-blur px-2 py-1 text-[10px] font-bold font-mono border border-white/10 uppercase ${gradeColor}`}>
                        {product.grade}
                     </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-white line-clamp-2 pr-2 font-mono uppercase">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3 h-3 text-matter-orange fill-matter-orange" />
                        <span className="text-xs text-slate-400 font-mono">{product.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* Mini Specs */}
                  {product.specs && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.specs.slice(0, 2).map((spec, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 border border-matter-border">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-matter-border pt-4">
                  <div className="flex flex-col">
                      <span className="text-xs text-slate-600 uppercase">Unit Price</span>
                      <span className="text-lg font-bold text-white font-mono">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={addingId === product.id}
                    className={`p-2 transition-all duration-300 flex items-center justify-center rounded-sm
                        ${addingId === product.id 
                            ? 'bg-green-500 text-white scale-110 shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                            : 'bg-white text-black hover:bg-slate-200'}`}
                    aria-label="Add to cart"
                  >
                    {addingId === product.id ? (
                        <Check className="h-5 w-5 animate-in zoom-in spin-in duration-300" />
                    ) : (
                        <Plus className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-matter-border rounded-lg">
             <Filter className="h-12 w-12 text-slate-700 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-white">No components found</h3>
             <p className="text-slate-500">The supply chain is empty for this query.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Marketplace;