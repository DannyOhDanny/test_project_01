export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  thumbnail: string;
  images: string[];
}

export interface Products {
  products: Product[] | null;
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsState {
  products: Products | null;
  searchProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  progress: number;
  total: number;
}

export interface ProductActions {
  getProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  searchProducts: (quote: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addProduct: (newProduct: Partial<Product>) => void;
  getProductsByPage: (
    limit: number,
    skip: number,
    sortBy: string | undefined,
    order: 'asc' | 'desc' | undefined
  ) => Promise<void>;
}
