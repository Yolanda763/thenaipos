import React, { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { saleService } from '@/services/saleService';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import toast from 'react-hot-toast';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export const Cashier: React.FC = () => {
  const [barcode, setBarcode] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const handleScanBarcode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const product = await productService.getProductByBarcode(barcode);
      
      const existingItem = cartItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
            : item
        ));
      } else {
        setCartItems([...cartItems, {
          productId: product.id,
          name: product.name,
          price: parseFloat(product.price),
          quantity: 1,
          subtotal: parseFloat(product.price),
        }]);
      }
      
      setBarcode('');
      toast.success('Produk ditambahkan ke keranjang');
    } catch (error: any) {
      toast.error('Produk tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }

    try {
      await saleService.createSale({
        items: cartItems,
        paymentMethod,
        subtotal: calculateTotal(),
        grandTotal: calculateTotal(),
      });

      toast.success('Transaksi berhasil');
      setCartItems([]);
      setPaymentMethod('CASH');
    } catch (error: any) {
      toast.error('Transaksi gagal');
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Scanner */}
      <div className="col-span-2">
        <Card title="🔍 Scan Produk">
          <form onSubmit={handleScanBarcode} className="mb-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Scan barcode atau ketik kode produk"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1"
              />
              <Button variant="primary" disabled={loading}>
                Scan
              </Button>
            </div>
          </form>

          {/* Cart Items */}
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Keranjang Belanja</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Keranjang kosong</p>
            ) : (
              <div className="space-y-2">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} x Rp{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="font-bold">Rp{item.subtotal.toLocaleString()}</p>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-xs px-2 py-1"
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Checkout */}
      <div>
        <Card title="💳 Pembayaran">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Total</label>
              <p className="text-3xl font-bold text-blue-600">Rp{calculateTotal().toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Metode Pembayaran</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input"
              >
                <option value="CASH">💵 Cash</option>
                <option value="TRANSFER">💳 Transfer</option>
                <option value="DEBIT_CARD">🏧 Debit Card</option>
                <option value="QRIS">📱 QRIS</option>
              </select>
            </div>

            <Button
              variant="success"
              className="w-full text-lg py-3"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              ✓ Bayar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
