export interface HardwareComponent {
  name: string;
  cost: number;
  specs: string;
  vendor?: string; 
  reason: string; // "Why we chose this"
}

export type ComplexityTier = 'TIER_1_HOBBY' | 'TIER_2_MAKER' | 'TIER_3_INDUSTRIAL';

export interface AIProductResult {
  productName: string;
  description: string;
  intentAnalysis: string; // "Detected School Project context..."
  complexityTier: ComplexityTier;
  technicalSpecs: string[];
  components: HardwareComponent[];
  diyPrice: number;
  assembledPrice: number;
  totalSavings: number; // "You saved ₹150..."
  estimatedBuildTime: string;
  category: string;
  assemblySteps: string[];
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  specs?: string[];
  bestVendor?: string;
  grade: 'Hobby' | 'Pro' | 'Industrial';
}

export interface CartItem {
  id: string;
  name: string;
  type: 'DIY_KIT' | 'ASSEMBLED' | 'STORE_ITEM';
  price: number;
  quantity: number;
  image?: string;
  details?: string;
  assemblyGuide?: string[];
  tier?: ComplexityTier;
}

export interface Order {
  id: string;
  trackingId: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
}

export type ViewState = 'HOME' | 'FOUNDRY' | 'BAZAAR' | 'CART' | 'PROFILE' | 'SIMULATION';

export interface UserProfile {
  name: string;
  email: string;
  workshopAddress: {
    houseNo: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
  };
}