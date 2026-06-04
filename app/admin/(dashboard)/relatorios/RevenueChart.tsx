'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-brand-gray-text bg-brand-black border border-brand-gray-light rounded-lg">
        Não há dados suficientes para o período selecionado.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-gray border border-brand-gray-light p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold mb-1">{label}</p>
          <p className="text-brand-orange font-bold font-mono">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[350px] w-full pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickMargin={10}
          />
          <YAxis 
            stroke="#888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `€${value}`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#333' }} />
          <Bar 
            dataKey="revenue" 
            fill="#E8600A" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
