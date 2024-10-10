'use client';

import { useState, useEffect } from "react";
import axios from 'axios';

// Add Item Form
function AddItemForm() {
  const [productName, setProductName] = useState('');  
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/items', { productName, quantity });
      console.log(response.data);
      setMessage('Item added successfully!');
      setProductName('');
      setQuantity(0);
    } catch (err) {
      console.error(err);
      setMessage('Error adding item. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Add Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input 
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter Product Name"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input 
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            placeholder="Enter Quantity"
            required
            min="0"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}

// List View Component
function ItemListView() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items');
        setItems(response.data);
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setError('Failed to load items.');
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Items List</h2>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="list-disc pl-5">
        {items.map((item) => (
          <li key={item._id} className="mb-2">
            <span className="font-medium">{item.productName}</span>: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Transaction Form
function TransactionForm() {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([{ action: 'In', productName: '', quantity: 0 }]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/items');
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === 'productName') {
      const selectedProduct = products.find(product => product.productName === value);
      if (selectedProduct) {
        updatedRows[index].quantity = selectedProduct.quantity;
      }
    }

    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { action: 'In', productName: '', quantity: 0 }]);
  };

  const handleRemoveRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const row of rows) {
      if (row.quantity <= 0) {
        setMessage('Quantity must be greater than 0.');
        return;
      }
    }

    try {
      await Promise.all(rows.map(async (row) => {
        await axios.post('/api/transactions', {
          action: row.action,
          productName: row.productName,
          quantity: row.quantity
        });
      }));
      setMessage('Transaction logged successfully.');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setMessage('Quantity must not exceed available stock.');
      } else {
        setMessage('Failed to log transaction. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Log Inventory Transaction</h2>
      <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <div key={index} className="flex space-x-4 mb-4">
            <select
              value={row.action}
              onChange={(e) => handleRowChange(index, 'action', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="In">In</option>
              <option value="Out">Out</option>
            </select>

            <select
              value={row.productName}
              onChange={(e) => handleRowChange(index, 'productName', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product.productName}>
                  {product.productName}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={row.quantity}
              onChange={(e) => handleRowChange(index, 'quantity', parseInt(e.target.value))}
              placeholder="Quantity"
              min="1"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button 
              type="button" 
              onClick={() => handleRemoveRow(index)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button"
          onClick={handleAddRow}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
        >
          Add Row
        </button>
        <button 
          type="submit"
          className="ml-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}

// Transaction List View Component
function TransactionListView() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions');
        setTransactions(response.data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load transactions.');
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="list-disc pl-5">
        {transactions.map((transaction) => (
          <li key={transaction._id} className="mb-2">
            <span className="font-medium">{transaction.productName}</span>: {transaction.action} {transaction.quantity} 
            <span className="text-gray-500"> on {new Date(transaction.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Main Page Component
export default function Page() {
  return (
    <div className="min-h-screen bg-[url('/factory.png')] bg-no-repeat bg-center bg-cover">
      <h1 className="text-center text-3xl font-bold mt-8">Inventory Management</h1>
      <AddItemForm />
      <ItemListView />
      <TransactionForm />
      <TransactionListView />
    </div>
  );
}

