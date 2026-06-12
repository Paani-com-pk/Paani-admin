import { Customer, Delivery, Metric, Order, Product, Subscription } from "./types";

export const metrics: Metric[] = [
  { label: "Orders today", value: "184", change: "+12% vs yesterday" },
  { label: "Revenue today", value: "PKR 128,400", change: "+8.4% vs yesterday" },
  { label: "Active subscriptions", value: "962", change: "+27 this week" },
  { label: "On-time delivery", value: "94.2%", change: "+1.8 pts this month" }
];

export const customers: Customer[] = [
  { id: "CUS-001", name: "Ayesha Khan", phone: "03001234567", zone: "Gulshan", activeSubscriptions: 1, totalOrders: 18 },
  { id: "CUS-002", name: "Fahad Ali", phone: "03004567890", zone: "DHA", activeSubscriptions: 2, totalOrders: 33 },
  { id: "CUS-003", name: "Orbit Tech", phone: "021111000222", zone: "PECHS", activeSubscriptions: 6, totalOrders: 49 }
];

export const products: Product[] = [
  { sku: "PAANI-500ML", name: "Paani 500ml Bottle", category: "Bottled Water", price: "PKR 60", status: "Active" },
  { sku: "PAANI-1L", name: "Paani 1L Bottle", category: "Bottled Water", price: "PKR 90", status: "Active" },
  { sku: "PAANI-19L", name: "Paani 19L Refillable Bottle", category: "Household Water", price: "PKR 380", status: "Active" }
];

export const orders: Order[] = [
  { id: "ORD-1048", customer: "Ayesha Khan", items: "2 x 19L Bottle", total: "PKR 760", status: "Assigned", slot: "9:00 AM - 12:00 PM" },
  { id: "ORD-1049", customer: "Orbit Tech", items: "12 x 1.5L Bottle", total: "PKR 1,560", status: "Out for delivery", slot: "12:00 PM - 3:00 PM" },
  { id: "ORD-1050", customer: "Fahad Ali", items: "4 x 5L Bottle", total: "PKR 1,040", status: "Pending", slot: "6:00 PM - 9:00 PM" }
];

export const deliveries: Delivery[] = [
  { id: "DEL-301", staff: "Bilal Ahmed", customer: "Ayesha Khan", status: "Assigned", eta: "10:20 AM" },
  { id: "DEL-302", staff: "Noman Shah", customer: "Orbit Tech", status: "In transit", eta: "1:15 PM" },
  { id: "DEL-303", staff: "Hassan Raza", customer: "Fahad Ali", status: "Completed", eta: "9:40 AM" }
];

export const subscriptions: Subscription[] = [
  { id: "SUB-430", customer: "Ayesha Khan", product: "19L Bottle", schedule: "Alternate day", status: "Active" },
  { id: "SUB-431", customer: "Orbit Tech", product: "19L Bottle", schedule: "Daily", status: "Active" },
  { id: "SUB-432", customer: "Fahad Ali", product: "19L Bottle", schedule: "Weekly", status: "Paused" }
];

