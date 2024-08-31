"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Cart from './Cart';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  collectionDate: string;
  qualities: string[];
  image: string;
  purchaseCount?: number;
  category: string;
  minQuantity: number;
  currentQuantity: number;
}

interface CartItem extends Product {
  cartQuantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Organic Apples', price: 10.99, originalPrice: 13.74, quantity: 50, minQuantity: 30, currentQuantity: 15, collectionDate: '2024-09-15', qualities: ['fresh', 'healthy choices', 'organic'], image: '/images/organic-apples.jpg', purchaseCount: 120, category: 'Food' },
  { id: 2, name: 'Sparkling Water', price: 1.50, originalPrice: 1.88, quantity: 100, minQuantity: 50, currentQuantity: 40, collectionDate: '2024-09-01', qualities: ['healthy choices'], image: '/images/sparkling-water.jpeg', purchaseCount: 85, category: 'Drinks' },
  { id: 3, name: 'Durian', price: 35.00, originalPrice: 43.75, quantity: 30, minQuantity: 20, currentQuantity: 22, collectionDate: '2024-09-20', qualities: ['fresh', 'singapore favourites'], image: '/images/ah-seng-durian.jpg', purchaseCount: 50, category: 'Food' },
  // Add more products as needed
];

const ProductList: React.FC = () => {
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [collectionDateRange, setCollectionDateRange] = useState<[string, string]>(['', '']);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activePage, setActivePage] = useState('deals');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPayments, setExpandedPayments] = useState<number[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'today' | 'thisWeek'>('all');
  const [activeOrdersTab, setActiveOrdersTab] = useState<'pending' | 'upcoming'>('pending');
  const [upcomingFilter, setUpcomingFilter] = useState<'all' | 'today' | 'thisWeek'>('all');
  const [collectedProducts, setCollectedProducts] = useState<{[key: string]: boolean}>({});

  const categories = ['All', 'Food', 'Drinks', 'Home Essentials','Personal Care', 'Family & Kids'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = products.filter(product =>
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedQualities.length === 0 || selectedQualities.every(q => product.qualities.includes(q))) &&
    (product.price >= priceRange[0] && product.price <= priceRange[1]) &&
    (collectionDateRange[0] === '' || product.collectionDate >= collectionDateRange[0]) &&
    (collectionDateRange[1] === '' || product.collectionDate <= collectionDateRange[1])
  );

  const featuredProducts = products.slice(0, 3); // Just using the first 3 products as featured for this example

  const handleQualityToggle = (quality: string) => {
    setSelectedQualities(prev =>
      prev.includes(quality)
        ? prev.filter(q => q !== quality)
        : [...prev, quality]
    );
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, cartQuantity: quantity }];
      }
    });
  };

  const updateCartItemQuantity = (id: number, newQuantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, cartQuantity: Math.max(0, newQuantity) }
          : item
      ).filter(item => item.cartQuantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically validate the credentials with a backend service
    // For this example, we'll just set isLoggedIn to true if both fields are filled
    if (phoneNumber && password) {
      setIsLoggedIn(true);
    } else {
      alert('Please enter both phone number and password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPhoneNumber('');
    setPassword('');
    setActivePage('deals');
  };

  const togglePaymentExpansion = (index: number) => {
    setExpandedPayments(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filterPayments = (payments: any[], filter: 'all' | 'today' | 'thisWeek') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    return payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      if (filter === 'today') {
        return paymentDate.toDateString() === today.toDateString();
      } else if (filter === 'thisWeek') {
        return paymentDate >= thisWeekStart && paymentDate <= today;
      }
      return true;
    });
  };

  const filterUpcomingCollections = (collections: any[], filter: 'all' | 'today' | 'thisWeek') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    return collections.filter(collection => {
      const collectionDate = new Date(collection.date);
      if (filter === 'today') {
        return collectionDate.toDateString() === today.toDateString();
      } else if (filter === 'thisWeek') {
        return collectionDate >= thisWeekStart && collectionDate <= today;
      }
      return true;
    });
  };

  const toggleProductCollected = (collectionIndex: number, productIndex: number) => {
    const key = `${collectionIndex}-${productIndex}`;
    setCollectedProducts(prev => ({...prev, [key]: !prev[key]}));
  };

  const LoginForm = () => (
    <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Member Login</h2>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign In
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-600">Group Buy at X</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActivePage('deals')}
                className={`px-4 py-2 rounded-full ${activePage === 'deals' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Special Deals 🔥
              </button>
              <button
                onClick={() => setActivePage('pending')}
                className={`px-4 py-2 rounded-full ${activePage === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                My Orders 📦
              </button>
              <button
                onClick={() => setActivePage('upcoming')}
                className={`px-4 py-2 rounded-full ${activePage === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Coming Soon 🚀
              </button>
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-3/4 px-4">
            {activePage === 'deals' && (
              <>
                {/* Updated Hero Banner with Search Bar */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg p-12 mb-8">
                  <h1 className="text-4xl font-bold mb-4">Welcome to Group Buy Store!</h1>
                  <p className="text-xl mb-6">Join the community, find amazing deals, and save big shopping together!</p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-4 pl-12 text-lg border-2 border-white rounded-full focus:outline-none focus:border-indigo-300 transition duration-300 bg-white bg-opacity-20 text-white placeholder-white"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>

                {/* Deals closing soon */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Deals closing soon ⏰</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredProducts.map(product => (
                      <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <div className="relative">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-full text-xs font-bold">
                            20% OFF
                          </div>
                        </div>
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                            <div className="flex items-baseline mb-2">
                              <span className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                              <span className="ml-2 text-lg text-gray-500 line-through">${(product.price * 1.25).toFixed(2)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300 mt-4"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Categories:</h3>
                    <div className="flex flex-wrap">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`mr-2 mb-2 px-3 py-1 rounded-full ${
                            selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Qualities:</h3>
                    <div className="flex flex-wrap">
                      {[ 'fresh','healthy choices', 'kid-friendly', 'organic', 'quick meals', 'singapore favourites', 'vegan' ].map(quality => (
                        <button
                          key={quality}
                          onClick={() => handleQualityToggle(quality)}
                          className={`mr-2 mb-2 px-3 py-1 rounded-full ${
                            selectedQualities.includes(quality) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Price Range:</h3>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                    <p>Price range: ${priceRange[0]} - ${priceRange[1]}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Collection Date Range:</h3>
                    <div className="flex space-x-4 items-center">
                      <input
                        type="date"
                        value={collectionDateRange[0]}
                        onChange={(e) => setCollectionDateRange([e.target.value, collectionDateRange[1]])}
                        className="border p-2 rounded w-1/3"
                      />
                      <span>to</span>
                      <input
                        type="date"
                        value={collectionDateRange[1]}
                        onChange={(e) => setCollectionDateRange([collectionDateRange[0], e.target.value])}
                        className="border p-2 rounded w-1/3"
                      />
                      <button
                        onClick={() => setCollectionDateRange(['', ''])}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition duration-300"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* All Products */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">All Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <div className="relative">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-full text-xs font-bold">
                            20% OFF
                          </div>
                        </div>
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                            <div className="flex items-baseline mb-2">
                              <span className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                              <span className="ml-2 text-lg text-gray-500 line-through">${(product.price * 1.25).toFixed(2)}</span>
                            </div>
                            <p className="text-gray-600 mb-2">Available: {product.quantity}</p>
                            <p className="text-gray-600 mb-2">Collection: {product.collectionDate}</p>
                            <div className="flex flex-wrap mb-2">
                              {product.qualities.map(quality => (
                                <span key={quality} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm mr-2 mb-2">{quality}</span>
                              ))}
                            </div>
                            {/* Progress bar */}
                            {product.currentQuantity < product.minQuantity && (
                              <div className="mt-2">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>{product.currentQuantity} / {product.minQuantity} ordered</span>
                                  <span>{Math.round((product.currentQuantity / product.minQuantity) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-indigo-600 h-2.5 rounded-full" 
                                    style={{width: `${(product.currentQuantity / product.minQuantity) * 100}%`}}
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {product.minQuantity - product.currentQuantity} more to hit minimum quantity!
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center mt-4">
                            <input
                              type="number"
                              min="1"
                              max={product.quantity}
                              defaultValue="1"
                              className="border p-1 w-16 mr-2"
                              id={`quantity-${product.id}`}
                            />
                            <button
                              onClick={() => {
                                const quantityInput = document.getElementById(`quantity-${product.id}`) as HTMLInputElement;
                                const quantity = parseInt(quantityInput.value, 10);
                                addToCart(product, quantity);
                              }}
                              className="flex-grow bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {activePage === 'pending' && (
              isLoggedIn ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold">My Orders</h2>
                    <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center shadow-md transform hover:scale-105 transition-transform duration-200">
                      <p className="text-lg font-semibold text-green-700 mb-1">Total Savings 💰</p>
                      <p className="text-3xl font-bold text-green-600">
                        ${[
                          { 
                            date: '2023-09-30', 
                            amount: 150.00, 
                            originalAmount: 187.50, // 25% more than the discounted price
                            payTo: 'ABC Store', 
                            paynow: '9123 4567', 
                            products: [
                              { ...products[0], quantity: 2 },
                              { ...products[1], quantity: 3 },
                            ]
                          },
                          { 
                            date: '2023-10-05', 
                            amount: 75.50, 
                            originalAmount: 94.38, // 25% more than the discounted price
                            payTo: 'XYZ Mart', 
                            paynow: '9876 5432', 
                            products: [
                              { ...products[2], quantity: 1 },
                              { ...products[0], quantity: 1 },
                            ]
                          },
                        ].reduce((total, payment) => total + (payment.originalAmount - payment.amount), 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-green-500 mt-1">from Group Buy</p>
                    </div>
                  </div>
                  
                  {/* Sub-page navigation */}
                  <div className="flex mb-4 border-b">
                    <button
                      onClick={() => setActiveOrdersTab('pending')}
                      className={`px-4 py-2 ${activeOrdersTab === 'pending' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
                    >
                      Pending Payments
                    </button>
                    <button
                      onClick={() => setActiveOrdersTab('upcoming')}
                      className={`px-4 py-2 ${activeOrdersTab === 'upcoming' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
                    >
                      Upcoming Collections
                    </button>
                  </div>
                  
                  {activeOrdersTab === 'pending' && (
                    <div id="pending-payments">
                      <div className="mb-4 flex space-x-2">
                        <button
                          onClick={() => setPaymentFilter('all')}
                          className={`px-4 py-2 rounded-full ${paymentFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setPaymentFilter('today')}
                          className={`px-4 py-2 rounded-full ${paymentFilter === 'today' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => setPaymentFilter('thisWeek')}
                          className={`px-4 py-2 rounded-full ${paymentFilter === 'thisWeek' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          This Week
                        </button>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4">
                        {/* Sample pending payment data - replace with actual data in a real application */}
                        {filterPayments([
                          { 
                            date: '2023-09-30', 
                            amount: 150.00, 
                            originalAmount: 187.50,
                            payTo: 'ABC Store', 
                            paynow: '9123 4567', 
                            products: [
                              { ...products[0], quantity: 2 },
                              { ...products[1], quantity: 3 },
                            ]
                          },
                          { 
                            date: '2023-10-05', 
                            amount: 75.50, 
                            originalAmount: 94.38,
                            payTo: 'XYZ Mart', 
                            paynow: '9876 5432', 
                            products: [
                              { ...products[2], quantity: 1 },
                              { ...products[0], quantity: 1 },
                            ]
                          },
                        ], paymentFilter).length > 0 ? (
                          <div className="space-y-6">
                            {filterPayments([
                              { 
                                date: '2023-09-30', 
                                amount: 150.00, 
                                originalAmount: 187.50,
                                payTo: 'ABC Store', 
                                paynow: '9123 4567', 
                                products: [
                                  { ...products[0], quantity: 2 },
                                  { ...products[1], quantity: 3 },
                                ]
                              },
                              { 
                                date: '2023-10-05', 
                                amount: 75.50, 
                                originalAmount: 94.38,
                                payTo: 'XYZ Mart', 
                                paynow: '9876 5432', 
                                products: [
                                  { ...products[2], quantity: 1 },
                                  { ...products[0], quantity: 1 },
                                ]
                              },
                            ], paymentFilter).map((payment, index) => {
                              const paymentDate = new Date(payment.date);
                              const dayOfWeek = paymentDate.toLocaleDateString('en-US', { weekday: 'short' });
                              const isExpanded = expandedPayments.includes(index);
                              const savings = payment.originalAmount - payment.amount;
                              return (
                                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                                  <div className="bg-gray-200 p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                      <div className="flex-1 mb-4 md:mb-0">
                                        <p className="text-2xl font-bold text-black">${payment.amount.toFixed(2)}</p>
                                        <p className="text-sm text-gray-600">Amount Due</p>
                                        <p className="text-sm text-green-600 font-semibold">You saved: ${savings.toFixed(2)}</p>
                                      </div>
                                      <div className="flex-1 text-right">
                                        <p className="text-2xl font-bold text-black">{payment.date}</p>
                                        <p className="text-sm text-gray-600">Payment Date ({dayOfWeek})</p>
                                      </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                      <p className="text-gray-700 mb-2 md:mb-0"><span className="font-semibold">Pay to:</span> {payment.payTo}</p>
                                      <p className="text-gray-700"><span className="font-semibold">Paynow:</span> {payment.paynow}</p>
                                    </div>
                                  </div>
                                  <div className="px-6 py-3 bg-gray-100">
                                    <button
                                      onClick={() => togglePaymentExpansion(index)}
                                      className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium focus:outline-none"
                                    >
                                      {isExpanded ? 'Hide Products ▲' : 'Show Products ▼'}
                                    </button>
                                  </div>
                                  {isExpanded && (
                                    <div className="p-6 border-t border-gray-200">
                                      <h4 className="font-semibold mb-2">Products:</h4>
                                      <div className="space-y-2">
                                        {payment.products.map((product, productIndex) => (
                                          <div key={productIndex} className="flex items-center space-x-4">
                                            <Image
                                              src={product.image}
                                              alt={product.name}
                                              width={50}
                                              height={50}
                                              className="rounded-full"
                                            />
                                            <div>
                                              <p className="font-medium">{product.name}</p>
                                              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-600">No pending payments found for the selected filter.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeOrdersTab === 'upcoming' && (
                    <div id="upcoming-collections">
                      <div className="mb-4 flex space-x-2">
                        <button
                          onClick={() => setUpcomingFilter('all')}
                          className={`px-4 py-2 rounded-full ${upcomingFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setUpcomingFilter('today')}
                          className={`px-4 py-2 rounded-full ${upcomingFilter === 'today' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => setUpcomingFilter('thisWeek')}
                          className={`px-4 py-2 rounded-full ${upcomingFilter === 'thisWeek' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          This Week
                        </button>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4">
                        {filterUpcomingCollections([
                          {
                            date: '2024-09-15',
                            products: [
                              { ...products[0], quantity: 2 },
                              { ...products[1], quantity: 3 },
                            ],
                            collected: false,
                          },
                          {
                            date: '2024-09-20',
                            products: [
                              { ...products[2], quantity: 1 },
                            ],
                            collected: false,
                          },
                        ], upcomingFilter).length > 0 ? (
                          <div className="space-y-6">
                            {filterUpcomingCollections([
                              {
                                date: '2024-09-15',
                                products: [
                                  { ...products[0], quantity: 2 },
                                  { ...products[1], quantity: 3 },
                                ],
                                collected: false,
                              },
                              {
                                date: '2024-09-20',
                                products: [
                                  { ...products[2], quantity: 1 },
                                ],
                                collected: false,
                              },
                            ], upcomingFilter).map((collection, collectionIndex) => {
                              const collectionDate = new Date(collection.date);
                              const dayOfWeek = collectionDate.toLocaleDateString('en-US', { weekday: 'long' });
                              const allCollected = collection.products.every((_, productIndex) => 
                                collectedProducts[`${collectionIndex}-${productIndex}`]
                              );
                              return (
                                <div key={collectionIndex} className="bg-white rounded-lg shadow-md p-4">
                                  <div className="flex justify-between items-center mb-4">
                                    <div>
                                      <p className="text-lg font-semibold">{collection.date} ({dayOfWeek})</p>
                                      <p className="text-sm text-gray-600">Collection Date</p>
                                    </div>
                                    <div className="flex items-center">
                                      <label htmlFor={`collected-${collectionIndex}`} className="flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          id={`collected-${collectionIndex}`}
                                          checked={allCollected}
                                          onChange={() => {
                                            collection.products.forEach((_, productIndex) => {
                                              toggleProductCollected(collectionIndex, productIndex);
                                            });
                                          }}
                                          className="form-checkbox h-5 w-5 text-indigo-600"
                                        />
                                        <span className="ml-2 text-lg font-semibold text-indigo-600">All Collected</span>
                                      </label>
                                    </div>
                                  </div>
                                  <h4 className="font-semibold mb-2">Products to Collect:</h4>
                                  <ul className="space-y-2">
                                    {collection.products.map((product, productIndex) => {
                                      const isCollected = collectedProducts[`${collectionIndex}-${productIndex}`];
                                      const isArrived = new Date() >= collectionDate;
                                      return (
                                        <li key={productIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                          <div className="flex items-center">
                                            <Image
                                              src={product.image}
                                              alt={product.name}
                                              width={40}
                                              height={40}
                                              className="rounded-full mr-2"
                                            />
                                            <span className={isCollected ? 'line-through text-gray-500' : ''}>
                                              {product.name} - Quantity: {product.quantity}
                                            </span>
                                          </div>
                                          <div className="flex items-center">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold mr-2 ${
                                              isArrived ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                              {isArrived ? 'Arrived' : 'Waiting'}
                                            </span>
                                            <input
                                              type="checkbox"
                                              checked={isCollected}
                                              onChange={() => isArrived && toggleProductCollected(collectionIndex, productIndex)}
                                              className={`form-checkbox h-5 w-5 ${isArrived ? 'text-indigo-600' : 'text-gray-400 cursor-not-allowed'}`}
                                              disabled={!isArrived}
                                            />
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-600">No upcoming collections found for the selected filter.</p>
                        )}
                        
                        {/* Placeholder for Google Maps */}
                        <div className="w-full h-64 bg-gray-300 rounded-lg my-4 flex items-center justify-center">
                          <p className="text-gray-600">Map placeholder</p>
                        </div>
                        
                        {/* Collection Address */}
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-semibold mb-2">Collection Point:</h4>
                          <p className="text-gray-700">123 Collection Street</p>
                          <p className="text-gray-700">Neighborhood Area</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <LoginForm />
              )
            )}
            {activePage === 'upcoming' && (
              isLoggedIn ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                  <p>Stay tuned for exciting new products arriving soon!</p>
                </div>
              ) : (
                <LoginForm />
              )
            )}
          </div>
          <div className="w-full lg:w-1/4 px-4">
            <Cart
              cart={cart}
              updateCartItemQuantity={updateCartItemQuantity}
              removeFromCart={removeFromCart}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductList;