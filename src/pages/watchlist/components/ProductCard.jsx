import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductCard = ({ product, isSelected, onSelect, onRemove, onEditAlert, onShare }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (e.target.closest('.checkbox-container') || e.target.closest('.menu-container')) {
      return;
    }
    navigate('/product-details', { state: { productId: product.id } });
  };

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

  const getAlertStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'triggered': return 'bg-warning text-warning-foreground';
      case 'paused': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="price-card p-4 relative group">
      {/* Selection Checkbox */}
      <div className="checkbox-container absolute top-3 left-3 z-10">
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect(product.id, e.target.checked)}
          className="bg-card border-2 border-border"
        />
      </div>

      {/* Quick Actions Menu */}
      <div className="menu-container absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMenu(!showMenu)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/80 backdrop-blur-sm"
        >
          <Icon name="MoreVertical" size={16} />
        </Button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg contextual-tooltip">
            <div className="p-1">
              <button
                onClick={() => {
                  onEditAlert(product.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors duration-150 flex items-center space-x-2"
              >
                <Icon name="Bell" size={14} />
                <span>Edit Alert</span>
              </button>
              <button
                onClick={() => {
                  onShare(product);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors duration-150 flex items-center space-x-2"
              >
                <Icon name="Share2" size={14} />
                <span>Share</span>
              </button>
              <hr className="my-1 border-border" />
              <button
                onClick={() => {
                  onRemove(product.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted rounded-md transition-colors duration-150 flex items-center space-x-2"
              >
                <Icon name="Trash2" size={14} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div 
        className="cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <div className="relative mb-3 overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
          />
          
          {/* Platform Logo */}
          <div className="absolute bottom-2 left-2">
            <div className="bg-card/90 backdrop-blur-sm rounded-md px-2 py-1 flex items-center space-x-1">
              <Image
                src={product.platform.logo}
                alt={product.platform.name}
                className="w-4 h-4 object-contain"
              />
              <span className="text-xs font-medium text-foreground">{product.platform.name}</span>
            </div>
          </div>

          {/* Alert Status Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAlertStatusColor(product.alertStatus)}`}>
              {product.alertStatus}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-foreground line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Price Information */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">
                {formatPrice(product.currentPrice)}
              </span>
              <div className={`flex items-center space-x-1 ${getPriceChangeColor(product.priceChange)}`}>
                <Icon name={getPriceChangeIcon(product.priceChange)} size={14} />
                <span className="text-sm font-medium">
                  {Math.abs(product.priceChange).toFixed(2)}%
                </span>
              </div>
            </div>

            {product.originalPrice && product.originalPrice !== product.currentPrice && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm font-medium text-success">
                  Save {formatPrice(product.originalPrice - product.currentPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Target Price */}
          {product.targetPrice && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Target:</span>
              <span className="font-medium text-foreground">
                {formatPrice(product.targetPrice)}
              </span>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Updated {product.lastUpdated}</span>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                product.inStock ? 'bg-success' : 'bg-destructive'
              }`}></div>
              <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;