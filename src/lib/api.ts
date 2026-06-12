import { apiBaseUrl } from "./config";

type ApiEnvelope<T> = {
  success: boolean;
  path: string;
  timestamp: string;
  data: T;
};

type RequestOptions = {
  token?: string | null;
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json().catch(() => null)) as
    | (ApiEnvelope<T> & { message?: string; error?: { message?: string | string[] } | string })
    | null;

  if (!response.ok) {
    const errorMessage =
      typeof payload?.error === "string"
        ? payload.error
        : Array.isArray(payload?.error?.message)
          ? payload?.error?.message.join(", ")
          : payload?.error?.message;

    throw new Error(errorMessage ?? payload?.message ?? "Request failed.");
  }

  if (!payload?.success) {
    throw new Error("Unexpected API response.");
  }

  return payload.data;
}

export type AuthSession = {
  accessToken: string;
  user: {
    sub: string;
    role: string;
    phone: string;
    name: string;
    customerType?: string | null;
    businessName?: string | null;
  };
};

export type AdminProfile = {
  id: string;
  role: string;
  name: string;
  phone: string;
  email?: string | null;
};

export type OverviewMetrics = {
  daily: {
    orders: number;
    revenue: number;
    deliveries: number;
  };
  monthly: {
    revenue: number;
    activeCustomers: number;
    activeSubscriptions: number;
  };
  operational: {
    orderCompletionRate: number;
    averageDeliveryTimeMinutes: number;
    customerRetention: number;
  };
};

export type CustomerRecord = {
  id: string;
  name: string;
  phone: string;
  businessName?: string | null;
  customerType?: string | null;
  addresses: { addressLine: string; label: string }[];
  orders: { id: string }[];
  subscriptions: { id: string; status: string }[];
};

export type ProductRecord = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number | string;
  active: boolean;
};

export type OrderRecord = {
  id: string;
  status: string;
  totalAmount: number;
  deliverySlot?: string | null;
  createdAt: string;
  user: { name: string; phone: string };
  items: {
    quantity: number;
    unitPrice: number;
    product: { name: string };
  }[];
  deliveryAssignment?: {
    id: string;
    status: string;
    deliveryStaff?: { name: string } | null;
  } | null;
};

export type DeliveryRecord = {
  id: string;
  status: string;
  assignedAt?: string | null;
  completedAt?: string | null;
  order: {
    id: string;
    status: string;
    user: { name: string };
    address?: { addressLine: string } | null;
  };
  deliveryStaff: { name: string; phone: string };
};

export type SubscriptionRecord = {
  id: string;
  status: string;
  scheduleType: string;
  quantity: number;
  product: { name: string };
  user: { name: string };
};

export const api = {
  login(phone: string, password: string) {
    return request<AuthSession>("/auth/login", {
      method: "POST",
      body: { phone, password },
    });
  },
  me(token: string) {
    return request<AdminProfile>("/users/me", { token });
  },
  overview(token: string) {
    return request<OverviewMetrics>("/reports/overview", { token });
  },
  customers(token: string) {
    return request<CustomerRecord[]>("/users/customers", { token });
  },
  products(token: string) {
    return request<ProductRecord[]>("/products/admin/all", { token });
  },
  orders(token: string) {
    return request<OrderRecord[]>("/orders", { token });
  },
  deliveries(token: string) {
    return request<DeliveryRecord[]>("/deliveries", { token });
  },
  subscriptions(token: string) {
    return request<SubscriptionRecord[]>("/subscriptions", { token });
  },
};
