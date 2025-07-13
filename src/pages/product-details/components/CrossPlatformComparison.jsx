import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CrossPlatformComparison = ({ comparisons }) => {
  const [sortBy, setSortBy] = useState('price');

  const sortedComparisons = [...comparisons].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'platform':
        return a.platform.localeCompare(b.platform);
      case 'availability':
        return a.availability === 'In Stock' ? -1 : 1;
      default:
        return 0;
    }
  });

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'In Stock':
        return 'text-success bg-success/10';
      case 'Out of Stock':
        return 'text-destructive bg-destructive/10';
      case 'Limited Stock':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const lowestPrice = Math.min(...comparisons.map(c => c.price));

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Cross-Platform Comparison</h2>
          <p className="text-sm text-muted-foreground">Compare prices across different platforms</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button
            variant={sortBy === 'price' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('price')}
          >
            Price
          </Button>
          <Button
            variant={sortBy === 'platform' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('platform')}
          >
            Platform
          </Button>
          <Button
            variant={sortBy === 'availability' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('availability')}
          >
            Stock
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Platform</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Availability</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rating</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Shipping</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedComparisons.map((comparison, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <Image
                        src={comparison.platformLogo}
                        alt={comparison.platform}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-foreground">{comparison.platform}</span>
                    {comparison.price === lowestPrice && (
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                        Best Price
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <span className="text-lg font-semibold text-foreground">${comparison.price}</span>
                    {comparison.originalPrice && comparison.originalPrice > comparison.price && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground line-through">
                          ${comparison.originalPrice}
                        </span>
                        <span className="text-xs text-success font-medium">
                          {Math.round(((comparison.originalPrice - comparison.price) / comparison.originalPrice) * 100)}% off
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(comparison.availability)}`}>
                    {comparison.availability}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm text-foreground">{comparison.rating}</span>
                    <span className="text-xs text-muted-foreground">({comparison.reviews})</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <span className="text-sm text-foreground">{comparison.shipping}</span>
                    <span className="text-xs text-muted-foreground">{comparison.shippingTime}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="ExternalLink"
                      onClick={() => window.open(comparison.url, '_blank')}
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {sortedComparisons.map((comparison, index) => (
          <div key={index} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <Image
                    src={comparison.platformLogo}
                    alt={comparison.platform}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{comparison.platform}</h3>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-warning fill-current" />
                    <span className="text-xs text-muted-foreground">{comparison.rating} ({comparison.reviews})</span>
                  </div>
                </div>
              </div>
              {comparison.price === lowestPrice && (
                <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                  Best Price
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-foreground">${comparison.price}</span>
                {comparison.originalPrice && comparison.originalPrice > comparison.price && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-muted-foreground line-through">
                      ${comparison.originalPrice}
                    </span>
                    <span className="text-xs text-success font-medium">
                      {Math.round(((comparison.originalPrice - comparison.price) / comparison.originalPrice) * 100)}% off
                    </span>
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(comparison.availability)}`}>
                {comparison.availability}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping: {comparison.shipping}</span>
              <span className="text-muted-foreground">{comparison.shippingTime}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              iconName="ExternalLink"
              iconPosition="left"
              onClick={() => window.open(comparison.url, '_blank')}
              fullWidth
            >
              View on {comparison.platform}
            </Button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success">${lowestPrice}</p>
            <p className="text-sm text-muted-foreground">Lowest Price</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              ${Math.max(...comparisons.map(c => c.price))}
            </p>
            <p className="text-sm text-muted-foreground">Highest Price</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              ${(comparisons.reduce((sum, c) => sum + c.price, 0) / comparisons.length).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Average Price</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              ${(Math.max(...comparisons.map(c => c.price)) - lowestPrice).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Max Savings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossPlatformComparison;