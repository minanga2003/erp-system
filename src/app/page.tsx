'use client';

import { useEffect, useState } from 'react';
import api from './services/api';
import { Employee } from './types/Employee';
import { Product } from './types/Product';
import { SalesOrder, SalesOrderItem } from './types/SalesOrder';

export default function HomePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  const [newEmployee, setNewEmployee] = useState<Employee>({
    firstName: '', lastName: '', department: '', role: ''
  });
  const [newProduct, setNewProduct] = useState<Product>({
    name: '', sku: '', category: '', stock: 0, reorderPoint: 0
  });

  const [searchEmpId, setSearchEmpId] = useState('');
  const [foundEmp, setFoundEmp] = useState<Employee | null>(null);

  const [searchProdId, setSearchProdId] = useState('');
  const [foundProd, setFoundProd] = useState<Product | null>(null);

  const [searchOrderId, setSearchOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState<SalesOrder | null>(null);

  const [orderItems, setOrderItems] = useState<SalesOrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  const addEmployee = async () => {
    await api.post('/employees', newEmployee);
    setNewEmployee({ firstName: '', lastName: '', department: '', role: '' });
    alert("Employee added");
  };

  const addProduct = async () => {
    await api.post('/products', newProduct);
    setNewProduct({ name: '', sku: '', category: '', stock: 0, reorderPoint: 0 });
    alert("Product added");
  };

  const findEmployee = async () => {
    try {
      const res = await api.get(`/employees/${searchEmpId}`);
      setFoundEmp(res.data);
    } catch {
      setFoundEmp(null);
      alert('Employee not found');
    }
  };

  const findProduct = async () => {
    try {
      const res = await api.get(`/products/${searchProdId}`);
      setFoundProd(res.data);
    } catch {
      setFoundProd(null);
      alert('Product not found');
    }
  };

  const findOrder = async () => {
    try {
      const res = await api.get(`/sales/${searchOrderId}`);
      setFoundOrder(res.data);
    } catch {
      setFoundOrder(null);
      alert('Order not found');
    }
  };

  const addItemToOrder = () => {
    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return alert("Invalid product");
    setOrderItems([...orderItems, { product, quantity, price }]);
    setSelectedProductId('');
    setQuantity(1);
    setPrice(0);
  };

  const removeItemFromOrder = (index: number) => {
    const updated = [...orderItems];
    updated.splice(index, 1);
    setOrderItems(updated);
  };

  const submitOrder = async () => {
    if (orderItems.length === 0) return alert("Add at least one item");
    await api.post('/sales', { items: orderItems });
    setOrderItems([]);
    alert("Order submitted successfully");
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1>Welcome to the system</h1>

      <section>
        <h2>Employees</h2>
        <div>
          <input placeholder="First Name" value={newEmployee.firstName} onChange={e => setNewEmployee({ ...newEmployee, firstName: e.target.value })} />
          <input placeholder="Last Name" value={newEmployee.lastName} onChange={e => setNewEmployee({ ...newEmployee, lastName: e.target.value })} />
          <input placeholder="Department" value={newEmployee.department} onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })} />
          <input placeholder="Role" value={newEmployee.role} onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })} />
          <button onClick={addEmployee}>Add</button>
        </div>
        <div>
          <input placeholder="Search by ID" value={searchEmpId} onChange={e => setSearchEmpId(e.target.value)} />
          <button onClick={findEmployee}>Find</button>
          {foundEmp && (
            <div className="found-box">
              Found: {foundEmp.firstName} {foundEmp.lastName} - {foundEmp.department}
            </div>
          )}
        </div>
      </section>

      <section>
        <h2>Products</h2>
        <div>
          <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input placeholder="SKU" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} />
          <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
          <input type="number" placeholder="Stock (Qty)" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} />
          <input type="number" placeholder="Reorder Point (Qty)" value={newProduct.reorderPoint} onChange={e => setNewProduct({ ...newProduct, reorderPoint: parseInt(e.target.value) })} />
          <button onClick={addProduct}>Add</button>
        </div>
        <div>
          <input placeholder="Search by ID" value={searchProdId} onChange={e => setSearchProdId(e.target.value)} />
          <button onClick={findProduct}>Find</button>
          {foundProd && (
            <div className="found-box">
              Found: {foundProd.name} - SKU: {foundProd.sku} - Category: {foundProd.category}
            </div>
          )}
        </div>
      </section>

      <section>
        <h2>Sales Orders</h2>
        <div>
          <input placeholder="Search by ID" value={searchOrderId} onChange={e => setSearchOrderId(e.target.value)} />
          <button onClick={findOrder}>Find</button>
          {foundOrder && (
            <div className="found-box">
              Found: Order #{foundOrder.id} - {foundOrder.total} LKR - Items: {foundOrder.items?.length}
            </div>
          )}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>Create New Sales Order</h3>
          <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} />
          <input type="number" placeholder="Price" value={price} onChange={e => setPrice(parseFloat(e.target.value))} />
          <button onClick={addItemToOrder}>Add Item</button>

          <ul>
            {orderItems.map((item, index) => (
              <li key={index}>
                {item.product.name} - Qty: {item.quantity} - Price: {item.price} {' '}
                <button style={{ marginLeft: '8px', color: 'red' }} onClick={() => removeItemFromOrder(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={submitOrder}>Submit Order</button>
        </div>
      </section>
    </main>
  );
}