import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PriceTrendChart = ({ products }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    Amazon: true,
    Walmart: true,
    Target: true,
    BestBuy: true
  });
  const [timeRange, setTimeRange] = useState('30d');

  // Mock historical price data
  const generatePriceHistory = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dataPoint = {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0]
      };

      // Generate price trends for each platform
      const basePrice = 299;
      dataPoint.Amazon = Math.floor(basePrice + Math.sin(i * 0.1) * 50 + Math.random() * 20);
      dataPoint.Walmart = Math.floor(basePrice + Math.cos(i * 0.15) * 40 + Math.random() * 25);
      dataPoint.Target = Math.floor(basePrice + Math.sin(i * 0.12) * 45 + Math.random() * 15);
      dataPoint.BestBuy = Math.floor(basePrice + Math.cos(i * 0.08) * 35 + Math.random() * 30);

      data.push(dataPoint);
    }

    return data;
  };

  const priceData = generatePriceHistory();

  const platformColors = {
    Amazon: '#FF9500',
    Walmart: '#0071CE',
    Target: '#CC0000',
    BestBuy: '#FFE600'
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center py-8">
          <Icon name="TrendingUp" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Price Trends Available</h3>
          <p className="text-muted-foreground">Add products to view price history and trends.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Price Trends</h3>
          <p className="text-sm text-muted-foreground">Historical price comparison across platforms</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
          {/* Time Range Selector */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {[
              { value: '7d', label: '7D' },
              { value: '30d', label: '30D' },
              { value: '90d', label: '90D' }
            ].map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range.value)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Toggles */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(platformColors).map(([platform, color]) => (
          <Checkbox
            key={platform}
            label={
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span>{platform}</span>
              </div>
            }
            checked={selectedPlatforms[platform]}
            onChange={() => handlePlatformToggle(platform)}
          />
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {Object.entries(platformColors).map(([platform, color]) => (
              selectedPlatforms[platform] && (
                <Line
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          onClick={() => console.log('Export chart data')}
        >
          Export Data
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Share2"
          onClick={() => console.log('Share chart')}
        >
          Share Chart
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          onClick={() => console.log('Refresh data')}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default PriceTrendChart;