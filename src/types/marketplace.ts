export type MaterialCategory =
  | 'Steel'
  | 'Aluminium'
  | 'Copper'
  | 'Plastic'
  | 'Rubber'
  | 'Cement';

export type CategoryFilter = 'All' | MaterialCategory;

export type SortOption =
  | 'rating-desc'
  | 'price-asc'
  | 'delivery-asc'
  | 'stock-desc';

export interface CustomerReview {
  id: string;
  supplierId: string;
  reviewerName: string;
  companyName: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  orderVolume: string;
  verifiedDelivery: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  materialName: string;
  category: MaterialCategory;
  pricePerUnit: number;
  unit: string;
  minOrderQty: number;
  qualityGrade: string;
  certifications: string[];
  rating: number;
  reviewCount: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  onTimeDeliveryRate: number;
  defectFreeRate: number;
  availableStock: number;
  location: string;
  region: string;
  yearsOperating: number;
  responseTimeHours: number;
  summary: string;
  imageUrl: string;
  imageAlt: string;
}

export interface BuyerAccount {
  fullName: string;
  companyName: string;
  email: string;
  role: string;
}

export interface QuoteRequest {
  id: string;
  supplierId: string;
  supplierName: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  estimatedTotal: number;
  deliveryLocation: string;
  notes: string;
  submittedAt: string;
}
