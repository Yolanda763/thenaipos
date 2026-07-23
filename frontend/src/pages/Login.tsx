import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login(email, password);
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">🏪 POS Kasir</h1>
          <p className="text-gray-600">Sistem Penjualan Modern</p>
        </div>

        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            type="email"
            placeholder="admin@thenai.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo Credentials:</p>
          <p>Admin: admin@thenai.com / Admin@123456</p>
          <p>Kasir: kasir@thenai.com / Kasir@123456</p>
        </div>
      </Card>
    </div>
  );
};
