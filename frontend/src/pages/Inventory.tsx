import React, { useState, useEffect } from 'react';
import { reportService } from '@/services/reportService';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface StockAlert {
  product: any;
  quantity: number;
  minStock: number;
  status: 'low' | 'critical';
}

export const Inventory: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const inventoryReport = await reportService.getInventoryReport();
      setReport(inventoryReport);
      
      const alertItems = inventoryReport.lowStockItems.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        minStock: item.minStock,
        status: item.quantity === 0 ? 'critical' : 'low',
      }));
      setAlerts(alertItems);
    } catch (error) {
      console.error('Failed to load inventory', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-gray-600">Total Item</p>
            <p className="text-3xl font-bold">{report?.totalItems}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600">Stok Rendah</p>
            <p className="text-3xl font-bold text-warning">{report?.lowStockItems}</p>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card title="⚠️ Peringatan Stok Rendah">
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded border-l-4 ${
                alert.status === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
              }`}>
                <p className="font-bold">{alert.product?.name}</p>
                <p className="text-sm">
                  Stok: {alert.quantity} pcs (Min: {alert.minStock} pcs)
                </p>
                <Button variant="primary" className="mt-2 text-xs px-2 py-1">
                  Pesan Sekarang
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
