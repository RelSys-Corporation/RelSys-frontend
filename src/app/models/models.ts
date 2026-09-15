export interface Supplier {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  suppliers: { id: number; name: string }[];
  name: string;
  price: number;
  barcode: string;
  record: string;
}

export interface ProductBatch {
  id: number;
  productId: number;
  purchasePrice: number;
  purchaseQuantity: number;
  remainingQuantity: number;
  record: string;
}

export interface Sell {
  id: number;
  record: string;
  items: ProductSell[];
}

export interface ProductSell {
  id: number;
  sellId: number;
  productId: number;
  batchId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  purchasePrice: number;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  barcode: string;
  supplierId?: number;
}

export interface CreateSupplierRequest {
  name: string;
}

export interface ReceiveProductRequest {
  productId: number;
  supplierId: number;
  purchasePrice: number;
  quantity: number;
}

export interface LabelRequest {
  productId: number;
  quantity: number;
}

export enum PaymentMethod {
  Cash = 1,
  Pix = 2,
  Debit = 3,
  CreditOnSight = 4,
  CreditOnTerm = 5,
}

export const PAYMENT_METHODS: { id: number; label: string }[] = [
  { id: PaymentMethod.Cash, label: 'Dinheiro' },
  { id: PaymentMethod.Pix, label: 'Pix' },
  { id: PaymentMethod.Debit, label: 'Débito' },
  { id: PaymentMethod.CreditOnSight, label: 'Crédito à vista' },
  { id: PaymentMethod.CreditOnTerm, label: 'Crédito à prazo' },
];

export interface SellItemRequest {
  productId: number;
  quantity: number;
}

export interface SellRequest {
  items: SellItemRequest[];
  discount: number;
  paymentMethod: number;
}
