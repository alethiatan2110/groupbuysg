import React from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  cartQuantity: number;
}

interface CartProps {
  cart: CartItem[];
  updateCartItemQuantity: (id: number, newQuantity: number) => void;
  removeFromCart: (id: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateCartItemQuantity, removeFromCart, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
  const totalOriginal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.cartQuantity, 0);
  const totalSavings = totalOriginal - total;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="flex flex-col mb-4 pb-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <span className="font-semibold text-indigo-600">${(item.price * item.cartQuantity).toFixed(2)}</span>
              </div>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => updateCartItemQuantity(item.id, item.cartQuantity - 1)}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l hover:bg-gray-300"
                >
                  -
                </button>
                <span className="bg-gray-100 px-4 py-1">{item.cartQuantity}</span>
                <button
                  onClick={() => updateCartItemQuantity(item.id, item.cartQuantity + 1)}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="text-sm text-green-600 mt-1">
                You save: ${((item.originalPrice || item.price) - item.price) * item.cartQuantity}
              </div>
            </div>
          ))}
          <div className="mt-6">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <button
              onClick={onCheckout}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300 mt-4"
            >
              Submit Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;