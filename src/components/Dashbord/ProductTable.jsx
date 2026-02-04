import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import EditProductModal from "./EditProductModal";

const ProductTable = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editingProduct, setEditingProduct] = React.useState(null);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Assuming public endpoint or using token if needed
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-green-700">Loading Products...</div>;

  /* Removed late declaration */

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p.id !== id));
      // toast.success("Product deleted"); 
    } catch (error) {
      console.error("Delete failed", error);
      // toast.error("Failed to delete");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">My Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-green-100">
            <tr className="text-left text-gray-700">
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-green-50 transition-colors">
                  <td className="p-3 font-medium text-gray-800 flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-gray-100 overflow-hidden">
                      {product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}
                    </div>
                    {product.name}
                  </td>
                  <td className="p-3 text-green-700">₹{product.price}</td>
                  <td className="p-3 text-gray-600">{product.unit}</td>
                  <td className="p-3 font-bold">{product.stock}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-3 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={(updatedProduct) => {
            setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
          }}
        />
      )}
    </div>
  );
};

export default ProductTable;
