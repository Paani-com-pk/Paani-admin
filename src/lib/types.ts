export type Metric = {
  label: string;
  value: string;
  change: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  zone: string;
  activeSubscriptions: number;
  totalOrders: number;
};

export type Product = {
  sku: string;
  name: string;
  category: string;
  price: string;
  status: string;
};

export type Order = {
  id: string;
  customer: string;
  items: string;
  total: string;
  status: string;
  slot: string;
};

export type Delivery = {
  id: string;
  staff: string;
  customer: string;
  status: string;
  eta: string;
};

export type Subscription = {
  id: string;
  customer: string;
  product: string;
  schedule: string;
  status: string;
};

