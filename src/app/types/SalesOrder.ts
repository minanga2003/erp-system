import { Product } from "./Product";

export interface SalesOrderItem {
    product: Product;
    quantity: number;
    price: number;
  }
  
  export interface SalesOrder {
    id?: number;
    createdAt?: string;
    total?: number;
    items: SalesOrderItem[];
  }