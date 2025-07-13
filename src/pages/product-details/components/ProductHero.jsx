import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductHero = ({ product, onAddToWatchlist, onCompare, onShare }) => {
  const getPriceChangeColor = (change) => {
    if (change > 0) return 'text-destructive';
    if (change < 0) return 'text-success';
    return 'text-muted-foreground';
  };

  const getPriceChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.availability === 'In Stock' ?'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
            }`}>
              {product.availability}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {product.platform}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {product.name}
            </h1>
            <p className="text-muted-foreground">{product.brand}</p>
          </div>

          {/* Current Price */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl lg:text-4xl font-bold text-foreground">
                ${product.currentPrice}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon 
                name={getPriceChangeIcon(product.priceChange)} 
                size={16} 
                className={getPriceChangeColor(product.priceChange)}
              />
              <span className={`text-sm font-medium ${getPriceChangeColor(product.priceChange)}`}>
                {product.priceChange > 0 ? '+' : ''}${Math.abs(product.priceChange)} 
                ({product.priceChangePercent > 0 ? '+' : ''}{product.priceChangePercent}%)
              </span>
              <span className="text-sm text-muted-foreground">vs last week</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground">Lowest Price</p>
              <p className="text-lg font-semibold text-success">${product.lowestPrice}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Price</p>
              <p className="text-lg font-semibold text-foreground">${product.averagePrice}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="default"
              iconName="Heart"
              iconPosition="left"
              onClick={onAddToWatchlist}
              className="flex-1 sm:flex-none"
            >
              Add to Watchlist
            </Button>
            <Button
              variant="outline"
              iconName="GitCompare"
              iconPosition="left"
              onClick={onCompare}
            >
              Compare
            </Button>
            <Button
              variant="outline"
              iconName="Share2"
              iconPosition="left"
              onClick={onShare}
            >
              Share
            </Button>
          </div>

          {/* Quick Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="text-foreground">{product.lastUpdated}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tracking Since:</span>
              <span className="text-foreground">{product.trackingSince}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Price Checks:</span>
              <span className="text-foreground">{product.priceChecks} times</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;