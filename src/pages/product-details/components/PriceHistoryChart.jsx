import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import Button from '../../../components/ui/Button';

const PriceHistoryChart = ({ priceHistory, product }) => {
  const [timeRange, setTimeRange] = useState('1M');

  const timeRanges = [
    { label: '7D', value: '7D' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: 'All', value: 'All' }
  ];

  const filterDataByTimeRange = (data, range) => {
    const now = new Date();
    let startDate;

    switch (range) {
      case '7D':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3M':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6M':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }

    return data.filter(item => new Date(item.date) >= startDate);
  };

  const filteredData = filterDataByTimeRange(priceHistory, timeRange);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-lg font-bold text-primary">${payload[0].value}</p>
          {data.event && (
            <p className="text-xs text-muted-foreground mt-1">{data.event}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const lowestPrice = Math.min(...filteredData.map(d => d.price));
  const highestPrice = Math.max(...filteredData.map(d => d.price));

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Price History</h2>
          <p className="text-sm text-muted-foreground">Track price changes over time</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            
            {/* Reference lines for lowest and highest prices */}
            <ReferenceLine 
              y={lowestPrice} 
              stroke="var(--color-success)" 
              strokeDasharray="5 5"
              label={{ value: `Lowest: $${lowestPrice}`, position: "topLeft" }}
            />
            <ReferenceLine 
              y={highestPrice} 
              stroke="var(--color-destructive)" 
              strokeDasharray="5 5"
              label={{ value: `Highest: $${highestPrice}`, position: "bottomLeft" }}
            />
            
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Lowest: ${lowestPrice}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span className="text-muted-foreground">Highest: ${highestPrice}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Current: ${product.currentPrice}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Export chart data')}
          >
            Export Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="ZoomIn"
            onClick={() => console.log('Zoom chart')}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryChart;