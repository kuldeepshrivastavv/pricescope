import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onRemove, onSetAlert, onViewDetails }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    await onRemove(product.id);
    setIsLoading(false);
  };

  const handleSetAlert = () => {
    onSetAlert(product.id);
  };

  const handleViewDetails = () => {
    onViewDetails(product.id);
  };

  const getPriceChangeColor = () => {
    if (product.priceChange > 0) return 'text-destructive';
    if (product.priceChange < 0) return 'text-success';
    return 'text-muted-foreground';
  };

  const getPriceChangeIcon = () => {
    if (product.priceChange > 0) return 'TrendingUp';
    if (product.priceChange < 0) return 'TrendingDown';
    return 'Minus';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  const getPlatformLogo = (platform) => {
    const logos = {
      'Amazon': 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=32&h=32&fit=crop&crop=center',
      'Flipkart': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=32&h=32&fit=crop&crop=center',
      'Myntra': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=32&h=32&fit=crop&crop=center',
      'Croma': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=32&h=32&fit=crop&crop=center'
    };
    return logos[platform] || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=32&h=32&fit=crop&crop=center';
  };

  return (
    <div className="price-card p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200">
      {/* Product Image */}
      <div className="relative mb-3 overflow-hidden rounded-lg">
        <div className="aspect-square w-full h-48 bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onClick={handleViewDetails}
          />
        </div>
        
        {/* Platform Badge */}
        <div className="absolute top-2 left-2 flex items-center space-x-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
          <Image
            src={getPlatformLogo(product.platform)}
            alt={product.platform}
            className="w-4 h-4 rounded-full"
          />
          <span className="text-xs font-medium text-foreground">{product.platform}</span>
        </div>

        {/* Alert Badge */}
        {product.hasAlert && (
          <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1">
            <Icon name="Bell" size={12} />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 
            className="font-medium text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors duration-200"
            onClick={handleViewDetails}
          >
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Added {new Date(product.addedDate).toLocaleDateString()}
          </p>
        </div>

        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-foreground">
                {formatPrice(product.currentPrice)}
              </span>
              <div className={`flex items-center space-x-1 ${getPriceChangeColor()}`}>
                <Icon name={getPriceChangeIcon()} size={14} />
                <span className="text-sm font-medium">
                  {Math.abs(product.priceChange).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {product.originalPrice !== product.currentPrice && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-sm text-success font-medium">
                Save {formatPrice(product.originalPrice - product.currentPrice)}
              </span>
            </div>
          )}

          {/* Price History Indicator */}
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="TrendingDown" size={12} />
            <span>Lowest: {formatPrice(product.lowestPrice)}</span>
            <span>•</span>
            <span>Highest: {formatPrice(product.highestPrice)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Bell"
            iconPosition="left"
            onClick={handleSetAlert}
            className="flex-1"
          >
            {product.hasAlert ? 'Edit Alert' : 'Set Alert'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={handleRemove}
            loading={isLoading}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          />
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center space-x-1 ${
            product.inStock ? 'text-success' : 'text-destructive'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              product.inStock ? 'bg-success' : 'bg-destructive'
            }`}></div>
            <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          
          <span className="text-muted-foreground">
            Updated {new Date(product.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;