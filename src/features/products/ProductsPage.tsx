import { useEffect, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { PageState } from "../../components/PageState";
import { ProductRecord, api } from "../../lib/api";

type ProductsPageProps = {
  token: string;
};

export function ProductsPage({ token }: ProductsPageProps) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await api.products(token);
        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <PageState title="Loading products" message="Fetching product catalog from the backend." />;
  }

  if (error) {
    return <PageState title="Products unavailable" message={error} tone="error" />;
  }

  return (
    <DataTable
      title="Products"
      subtitle="Manage bottled water SKUs, household inventory, and active pricing."
      columns={["SKU", "Name", "Category", "Price", "Status"]}
      rows={products}
      emptyMessage="No products found in the UAT catalog."
      renderRow={(product) => (
        <tr key={product.sku}>
          <td>{product.sku}</td>
          <td>{product.name}</td>
          <td>{product.category}</td>
          <td>PKR {Number(product.price).toLocaleString()}</td>
          <td>{product.active ? "Active" : "Inactive"}</td>
        </tr>
      )}
    />
  );
}
