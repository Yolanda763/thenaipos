import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, ShoppingCart, Package } from 'lucide-react';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authService.logout();
    toast.success('Logout berhasil');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">🏪 POS Kasir</h1>
          <p className="text-sm text-gray-400 mt-1">{user.fullName}</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Home size={20} />
            Dashboard
          </Link>

          <Link
            to="/cashier"
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <ShoppingCart size={20} />
            Kasir
          </Link>

          <Link
            to="/inventory"
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Package size={20} />
            Inventory
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
