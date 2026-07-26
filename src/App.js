import React, { useState } from 'react';

const initialProducts = [
  { id: 1, name: 'Whey Protein 1kg', vendor: 'S.K. Fitness Store', price: 2499, category: 'Supplements', stock: true, image: '💪' },
  { id: 2, name: 'Fresh Organic Milk (1L)', vendor: 'Gupta Dairy', price: 66, category: 'Grocery', stock: true, image: '🥛' },
  { id: 3, name: 'Fresh Paneer (200g)', vendor: 'Gupta Dairy', price: 90, category: 'Grocery', stock: true, image: '🧀' },
  { id: 4, name: 'Peanut Butter 1kg', vendor: 'S.K. Fitness Store', price: 449, category: 'Supplements', stock: false, image: '🥜' },
  { id: 5, name: 'Desi Ghee (1L)', vendor: 'Gupta Dairy', price: 650, category: 'Grocery', stock: true, image: '🧈' },
];

export default function App() {
  const [role, setRole] = useState('customer');
  const [activeVendor, setActiveVendor] = useState('S.K. Fitness Store');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(initialProducts);
  
  // Cart, Payment & Orders State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showQRModal, setShowQRModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orders, setOrders] = useState([
    {
      id: 'ORD-892112',
      customerName: 'Raja Kumar',
      customerPhone: '9876543210',
      deliveryAddress: 'Muzaffarpur, Bihar',
      items: [{ id: 1, name: 'Whey Protein 1kg', vendor: 'S.K. Fitness Store', price: 2499, qty: 1, image: '💪' }],
      totalAmount: 2529,
      paymentMethod: 'UPI',
      status: 'Pending',
      date: '10:30 AM'
    }
  ]);

  // Vendor State for New Product Form
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Grocery');
  const [newProductEmoji, setNewProductEmoji] = useState('📦');

  // Add Product Function
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return alert('Kripya sabhi details bharein');

    const newProd = {
      id: Date.now(),
      name: newProductName,
      vendor: activeVendor,
      price: Number(newProductPrice),
      category: newProductCategory,
      stock: true,
      image: newProductEmoji,
    };

    setProducts([newProd, ...products]);
    setNewProductName('');
    setNewProductPrice('');
    alert(`✅ Naya Product ${activeVendor} me jud gaya!`);
  };

  // Stock Toggle Function
  const toggleStock = (id) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, stock: !p.stock } : p))
    );
  };

  // Delete Product Function
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // 🛒 CART FUNCTIONS
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryCharge = cart.length > 0 ? 30 : 0;
  const cartTotal = cartSubtotal + deliveryCharge;

  // Checkout Handler
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deliveryAddress) {
      return alert('Kripya delivery ki sabhi details bharein!');
    }

    if (paymentMethod === 'UPI') {
      setShowQRModal(true);
    } else {
      finalizeOrder('COD');
    }
  };

  const finalizeOrder = (methodUsed) => {
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerName,
      customerPhone,
      deliveryAddress,
      items: cart,
      totalAmount: cartTotal,
      paymentMethod: methodUsed,
      status: 'Pending',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setShowQRModal(false);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    alert(`🎉 Order Placed Successfully! Your Order ID: ${newOrder.id}`);
  };

  // Order Status Update Handler
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const matchesStore = selectedStoreFilter === 'All' || p.vendor === selectedStoreFilter;
    const matchesCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStore && matchesCategory && matchesSearch;
  });

  // Admin Calculations
  const totalPlatformRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const adminCommission = Math.round(totalPlatformRevenue * 0.10);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px', position: 'relative' }}>
      
      {/* Navbar Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', color: 'white', padding: '15px 25px', borderRadius: '12px', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '22px' }}>🛍️ LocalMart <span style={{ fontSize: '12px', color: '#38bdf8' }}>Multi-Vendor</span></h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {role === 'customer' && (
            <button 
              onClick={() => setIsCartOpen(true)}
              style={{ padding: '8px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              🛒 Cart ({cart.reduce((a, b) => a + b.qty, 0)})
            </button>
          )}

          <div>
            <span style={{ marginRight: '10px', fontSize: '14px', color: '#94a3b8' }}>View Mode:</span>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#0284c7', color: 'white' }}
            >
              <option value="customer">Customer View</option>
              <option value="vendor">Vendor Portal</option>
              <option value="admin">Main Admin</option>
            </select>
          </div>
        </div>
      </header>

      {/* CUSTOMER VIEW */}
      {role === 'customer' && (
        <div>
          {/* Search & Multi-Filters Bar */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* 🔍 Search Input */}
            <input 
              type="text"
              placeholder="🔍 Search products (e.g. Milk, Whey Protein)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              {/* Store Filter */}
              <div>
                <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#64748b', fontSize: '14px' }}>Store:</span>
                <button onClick={() => setSelectedStoreFilter('All')} style={{ padding: '6px 12px', margin: '0 3px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: selectedStoreFilter === 'All' ? '#0f172a' : '#f1f5f9', color: selectedStoreFilter === 'All' ? 'white' : '#334155', fontWeight: 'bold', fontSize: '13px' }}>All</button>
                <button onClick={() => setSelectedStoreFilter('S.K. Fitness Store')} style={{ padding: '6px 12px', margin: '0 3px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: selectedStoreFilter === 'S.K. Fitness Store' ? '#2563eb' : '#f1f5f9', color: selectedStoreFilter === 'S.K. Fitness Store' ? 'white' : '#334155', fontWeight: 'bold', fontSize: '13px' }}>🏋️ S.K. Fitness</button>
                <button onClick={() => setSelectedStoreFilter('Gupta Dairy')} style={{ padding: '6px 12px', margin: '0 3px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: selectedStoreFilter === 'Gupta Dairy' ? '#059669' : '#f1f5f9', color: selectedStoreFilter === 'Gupta Dairy' ? 'white' : '#334155', fontWeight: 'bold', fontSize: '13px' }}>🥛 Gupta Dairy</button>
              </div>

              {/* Category Filter */}
              <div>
                <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#64748b', fontSize: '14px' }}>Category:</span>
                <button onClick={() => setSelectedCategoryFilter('All')} style={{ padding: '6px 12px', margin: '0 3px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: selectedCategoryFilter === 'All' ? '#0284c7' : '#f1f5f9', color: selectedCategoryFilter === 'All' ? 'white' : '#334155', fontWeight: 'bold', fontSize: '13px' }}>All</button>
                <button onClick={() => setSelectedCategoryFilter('Grocery')} style={{ padding: '6px 12px', margin: '0 3px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: selectedCategoryFilter === 'Grocery' ? '#0284c7' : '#f1f5f9', color: selectedCategoryFilter === 'Grocery' ? 'white' : '#334155', fontWeight: 'bold', fontSize: '13px' }}>Grocery & Dairy</button>
                <button onClick={() => setSelectedCategoryFilter('Supplements')} style={{ padding: '6px 12px', margin: '0 3px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: selectedCategoryFilter === 'Supplements' ? '#0284c7' : '#f1f5f9', color: selectedCategoryFilter === 'Supplements' ? 'white' : '#334155', fontWeight: 'bold', fontSize: '13px' }}>Supplements</button>
              </div>
            </div>
          </div>

          {/* Product Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {filteredProducts.length === 0 ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', padding: '40px' }}>Koi product nahi mila!</p>
            ) : (
              filteredProducts.map((p) => (
                <div key={p.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{p.image}</div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{p.name}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#0284c7', fontSize: '13px', fontWeight: 'bold' }}>🏪 {p.vendor}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>₹{p.price}</span>
                    <button 
                      disabled={!p.stock}
                      onClick={() => addToCart(p)}
                      style={{ padding: '8px 14px', backgroundColor: p.stock ? '#2563eb' : '#94a3b8', color: 'white', border: 'none', borderRadius: '6px', cursor: p.stock ? 'pointer' : 'not-allowed' }}
                    >
                      {p.stock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}{/* 🛒 SIDE CART DRAWER & PAYMENT OPTIONS */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh', backgroundColor: 'white', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', zIndex: 1000, padding: '20px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>🛒 Your Shopping Cart</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>❌</button>
            </div>

            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Aapka Cart khali hai!</p>
            ) : (
              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.image} {item.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>₹{item.price} x {item.qty}</div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>-</button>
                      <span style={{ fontWeight: 'bold' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>+</button>
                      <button onClick={() => removeFromCart(item.id)} style={{ padding: '2px 6px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', marginLeft: '6px', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '15px', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', color: '#64748b' }}>
                <span>Subtotal:</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#64748b' }}>
                <span>Delivery Fee:</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                <span>Total Amount:</span>
                <span>₹{cartTotal}</span>
              </div>

              {/* Checkout Form & Payment Select */}
              <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  required 
                />
                <input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  value={customerPhone} 
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  required 
                />
                <textarea 
                  placeholder="Delivery Address" 
                  value={deliveryAddress} 
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', height: '40px' }}
                  required 
                />

                {/* 💳 Payment Mode Selection */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Select Payment Method:</label>
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}
                  >
                    <option value="COD">💵 Cash on Delivery (COD)</option>
                    <option value="UPI">📱 Pay Online (UPI / GPay / PhonePe)</option>
                  </select>
                </div>

                <button type="submit" style={{ padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '5px' }}>
                  {paymentMethod === 'UPI' ? '📲 Proceed to UPI Payment' : '🚀 Place Order (COD)'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 📲 UPI QR CODE PAYMENT MODAL */}
      {showQRModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', textOverflow: 'ellipsis', textAlign: 'center', maxWidth: '340px', width: '90%' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>📱 Scan & Pay via UPI</h3>
            <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '14px' }}>Scan using Google Pay, PhonePe, or Paytm</p>
            
            <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=localmart@upi&pn=LocalMart&am=${cartTotal}`} 
                alt="UPI QR Code" 
                style={{ width: '180px', height: '180px' }}
              />
            </div>

            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669', marginBottom: '15px' }}>Amount: ₹{cartTotal}</div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowQRModal(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={() => finalizeOrder('UPI')} style={{ flex: 1, padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>I Have Paid ✅</button>
            </div>
          </div>
        </div>
      )}

      {/* VENDOR DASHBOARD PANEL */}
      {role === 'vendor' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ backgroundColor: '#e0f2fe', padding: '15px 20px', borderRadius: '10px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#0369a1' }}>Logged In Vendor Shop:</span>
            <select value={activeVendor} onChange={(e) => setActiveVendor(e.target.value)} style={{ padding: '8px 15px', borderRadius: '6px', border: '1px solid #0284c7', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white', color: '#0369a1' }}>
              <option value="S.K. Fitness Store">S.K. Fitness Store</option>
              <option value="Gupta Dairy">Gupta Dairy</option>
            </select>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginTop: 0, color: '#0f172a' }}>📦 Incoming Customer Orders ({activeVendor})</h3>
            {orders.length === 0 ? <p style={{ color: '#64748b' }}>Abhi koi order nahi aaya hai.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {orders.map((ord) => (
                  <div key={ord.id} style={{ border: '1px solid #cbd5e1', padding: '15px', borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0284c7' }}>{ord.id} <span style={{ fontSize: '12px', color: '#64748b' }}>({ord.date})</span></div>
                      <div style={{ fontWeight: 'bold', marginTop: '4px' }}>Customer: {ord.customerName} ({ord.customerPhone})</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>📍 {ord.deliveryAddress}</div>
                      <div style={{ marginTop: '8px', fontSize: '13px', color: '#0f172a' }}>
                        <strong>Items:</strong> {ord.items.map(i => `${i.name} x${i.qty}`).join(', ')}
                      </div>
                      <div style={{ marginTop: '4px', fontSize: '12px', fontWeight: 'bold', color: ord.paymentMethod === 'UPI' ? '#2563eb' : '#d97706' }}>
                        Payment: {ord.paymentMethod === 'UPI' ? '💳 Paid Online (UPI)' : '💵 Cash on Delivery'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>Total: ₹{ord.totalAmount}</div>
                      <select value={ord.status} onChange={(e) => updateOrderStatus(ord.id, e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #cbd5e1', backgroundColor: ord.status === 'Delivered' ? '#dcfce7' : ord.status === 'Out for Delivery' ? '#fef3c7' : '#fee2e2' }}>
                        <option value="Pending">🟡 Pending</option>
                        <option value="Out for Delivery">🚚 Out for Delivery</option>
                        <option value="Delivered">🟢 Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ marginTop: 0, color: '#0f172a' }}>🏬 Add Item to ({activeVendor})</h2>
            <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Product Name</label>
                <input type="text" placeholder="e.g. Fresh Milk" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Price (₹)</label>
                <input type="number" placeholder="e.g. 60" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Category</label>
                <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                  <option value="Grocery">Grocery / Dairy</option>
                  <option value="Supplements">Supplements</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Emoji</label>
                <select value={newProductEmoji} onChange={(e) => setNewProductEmoji(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                  <option value="🥛">🥛 Milk</option>
                  <option value="🧀">🧀 Paneer</option>
                  <option value="💪">💪 Supplement</option>
                  <option value="📦">📦 Other</option>
                </select>
              </div>
              <button type="submit" style={{ padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Item</button>
            </form>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginTop: 0 }}>📋 Inventory for: <span style={{ color: '#0284c7' }}>{activeVendor}</span></h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px' }}>Item</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Price</th>
                  <th style={{ padding: '12px' }}>Stock</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.filter((p) => p.vendor === activeVendor).map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.image} {p.name}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{p.category}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>₹{p.price}</td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => toggleStock(p.id)} style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: p.stock ? '#dcfce7' : '#fee2e2', color: p.stock ? '#15803d' : '#b91c1c' }}>
                        {p.stock ? '🟢 In Stock' : '🔴 Out of Stock'}
                      </button>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => handleDeleteProduct(p.id)} style={{ padding: '6px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN PANEL */}
      {role === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>Total Revenue</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', marginTop: '5px' }}>₹{totalPlatformRevenue}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>Profit (10% Comm.)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginTop: '5px' }}>₹{adminCommission}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>Total Orders</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px' }}>{orders.length}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}