import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: 'food' | 'drink' | 'household';
  price: number;
  qualities: string[];
}

const products: Product[] = [
  { id: 1, name: 'Organic Apples', category: 'food', price: 2.99, qualities: ['organic', 'fresh', 'local'] },
  { id: 2, name: 'Sparkling Water', category: 'drink', price: 1.50, qualities: ['sugar-free', 'carbonated'] },
  { id: 3, name: 'Laundry Detergent', category: 'household', price: 8.99, qualities: ['eco-friendly', 'concentrated'] },
  // Add more products as needed
];

const ProductList: React.FC = () => {
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);

  const handleQualityToggle = (quality: string) => {
    setSelectedQualities(prev =>
      prev.includes(quality)
        ? prev.filter(q => q !== quality)
        : [...prev, quality]
    );
  };

  const filteredProducts = products.filter(product =>
    selectedQualities.length === 0 || selectedQualities.every(q => product.qualities.includes(q))
  );

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Filter by Qualities:</h2>
        {['organic', 'fresh', 'local', 'sugar-free', 'eco-friendly'].map(quality => (
          <button
            key={quality}
            onClick={() => handleQualityToggle(quality)}
            className={`mr-2 mb-2 px-3 py-1 rounded ${
              selectedQualities.includes(quality) ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {quality}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>Qualities: {product.qualities.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;