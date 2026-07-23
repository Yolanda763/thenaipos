import React, { useState, useEffect } from 'react';
import { reportService } from '@/services/reportService';
import { Card } from '@/components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const [dailyReport, setDailyReport] = useState<any>(null);
  const [monthlyReport, setMonthlyReport] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const daily = await reportService.getDailySalesReport(today);
      setDailyReport(daily);

      const now = new Date();
      const monthly = await reportService.getMonthlyReport(now.getMonth() + 1, now.getFullYear());
      setMonthlyReport(monthly);

      const top = await reportService.getTopProducts(5);
      setTopProducts(top);
    } catch (error) {
      console.error('Failed to load reports', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-gray-600">Penjualan Hari Ini</p>
            <p className="text-2xl font-bold">Rp{dailyReport?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600">Transaksi</p>
            <p className="text-2xl font-bold">{dailyReport?.totalSales || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600">Profit Bulan Ini</p>
            <p className="text-2xl font-bold text-green-600">Rp{monthlyReport?.profit?.toLocaleString() || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600">Total Penjualan Bulan</p>
            <p className="text-2xl font-bold">Rp{monthlyReport?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card title="🏆 Produk Terlaris">
        <div className="space-y-2">
          {topProducts.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <p className="font-medium">{item.product?.name}</p>
              <div className="flex gap-4">
                <span className="text-sm">Qty: {item.totalQuantity}</span>
                <span className="text-sm font-bold">Transaksi: {item.totalTransactions}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
