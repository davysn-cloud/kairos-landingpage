import type { Category, Product, PaperType, Finishing, ProductVariant, PriceRule, CartItem, Order, OrderItem, Address } from "./schema";

export interface PriceRange {
  min: number;
  max: number;
}

export interface CategoryWithCount extends Category {
  productCount: number;
}

export interface ProductWithDetails extends Product {
  category: Category;
  variants: ProductVariant[];
  availablePapers: PaperType[];
  availableFinishings: Finishing[];
  priceRange: PriceRange;
  priceRules: PriceRule[];
}

export interface CategoryWithProducts extends Category {
  products: Array<Product & { priceRange: PriceRange }>;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  variant?: ProductVariant;
}

export interface CartSummary {
  items: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product?: Product })[];
  address?: Address;
}

export interface ShippingQuote {
  carrier: string;
  service: string;
  price: number;
  deliveryDays: number;
  melhorEnvioId?: number;
}

export interface CheckoutData {
  sessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  shippingOption: ShippingQuote;
  paymentMethod: "pix" | "boleto" | "card";
  notes?: string;
}
