import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AlertStatistics = () => {
  const monthlyTriggers = [
    { month: 'Jan', triggers: 12, savings: 245 },
    { month: 'Feb', triggers: 18, savings: 380 },
    { month: 'Mar', triggers: 15, savings: 290 },
    { month: 'Apr', triggers: 22, savings: 450 },
    { month: 'May', triggers: 28, savings: 620 },
    { month: 'Jun', triggers: 25, savings: 540 },
    { month: 'Jul', triggers: 31, savings: 720 }
  ];

  const alertTypeDistribution = [
    { name: 'Price Drop', value: 45, color: '#10B981' },
    { name: 'Target Reached', value: 30, color: '#2563EB' },
    { name: 'Back in Stock', value: 15, color: '#F59E0B' },
    { name: 'Price Increase', value: 10, color: '#EF4444' }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', triggers: 8, savings: 120 },
    { name: 'MacBook Air M2', triggers: 6, savings: 200 },
    { name: 'Sony WH-1000XM5', triggers: 5, savings: 75 },
    { name: 'iPad Pro 12.9"', triggers: 4, savings: 150 },
    { name: 'AirPods Pro 2', triggers: 3, savings: 45 }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Bell" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">147</p>
              <p className="text-xs text-muted-foreground">Total Alerts</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingDown" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">31</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">$720</p>
              <p className="text-xs text-muted-foreground">Total Savings</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Percent" size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">23%</p>
              <p className="text-xs text-muted-foreground">Avg. Discount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Triggers Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Monthly Alert Triggers</h3>
            <Icon name="BarChart3" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTriggers}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-foreground)'
                  }}
                />
                <Bar dataKey="triggers" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Type Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Alert Types</h3>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {alertTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-foreground)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {alertTypeDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Trend */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Savings Trend</h3>
          <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTriggers}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
                formatter={(value) => [formatPrice(value), 'Savings']}
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="var(--color-accent)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Most Active Products</h3>
          <Icon name="Star" size={20} className="text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.triggers} alerts triggered
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-success">
                  {formatPrice(product.savings)}
                </p>
                <p className="text-xs text-muted-foreground">saved</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertStatistics;