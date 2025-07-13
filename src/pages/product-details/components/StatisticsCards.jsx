import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsCards = ({ statistics }) => {
  const stats = [
    {
      title: 'Average Price',
      value: `$${statistics.averagePrice}`,
      change: statistics.averagePriceChange,
      changeType: statistics.averagePriceChange > 0 ? 'increase' : 'decrease',
      icon: 'TrendingUp',
      color: 'primary'
    },
    {
      title: 'Lowest Recorded',
      value: `$${statistics.lowestPrice}`,
      date: statistics.lowestPriceDate,
      icon: 'ArrowDown',
      color: 'success'
    },
    {
      title: 'Price Drop Frequency',
      value: `${statistics.priceDrops}`,
      subtitle: 'drops in 30 days',
      icon: 'BarChart3',
      color: 'warning'
    },
    {
      title: 'Potential Savings',
      value: `$${statistics.potentialSavings}`,
      subtitle: 'vs highest price',
      icon: 'DollarSign',
      color: 'accent'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'success':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'accent':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getChangeColor = (changeType) => {
    return changeType === 'increase' ? 'text-destructive' : 'text-success';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
              <Icon name={stat.icon} size={24} />
            </div>
            {stat.change && (
              <div className={`flex items-center space-x-1 ${getChangeColor(stat.changeType)}`}>
                <Icon 
                  name={stat.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                />
                <span className="text-sm font-medium">
                  {stat.changeType === 'increase' ? '+' : ''}${Math.abs(stat.change)}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            {stat.subtitle && (
              <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
            )}
            {stat.date && (
              <p className="text-xs text-muted-foreground">on {stat.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;