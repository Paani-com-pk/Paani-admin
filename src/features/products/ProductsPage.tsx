import { DataTable } from "../../components/DataTable";
import { products } from "../../lib/mock-data";

export function ProductsPage() {
  return (
    <DataTable
      title="Products"
      subtitle="Manage bottled water SKUs, household inventory, and active pricing."
      columns={["SKU", "Name", "Category", "Price", "Status"]}
      rows={products}
      renderRow={(product) => (
        <tr key={product.sku}>
          <td>{product.sku}</td>
          <td>{product.name}</td>
          <td>{product.category}</td>
          <td>{product.price}</td>
          <td>{product.status}</td>
        </tr>
      )}
    />
  );
}

