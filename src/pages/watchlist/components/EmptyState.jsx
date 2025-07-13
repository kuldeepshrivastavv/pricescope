import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const EmptyState = ({ hasFilters, onClearFilters }) => {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No products match your filters
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          Try adjusting your search criteria or clearing some filters to see more results.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => navigate('/dashboard')}
          >
            Add Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-8">
        <Image
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop"
          alt="Empty watchlist illustration"
          className="w-64 h-40 object-cover rounded-lg opacity-60"
        />
      </div>
      
      <h3 className="text-2xl font-semibold text-foreground mb-3">
        Your watchlist is empty
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
        Start tracking products by adding URLs from your favorite e-commerce sites. 
        Get notified when prices drop and never miss a great deal!
      </p>
      
      <div className="space-y-4 w-full max-w-sm">
        <Button
          variant="default"
          fullWidth
          iconName="Plus"
          iconPosition="left"
          onClick={() => navigate('/dashboard')}
        >
          Add Your First Product
        </Button>
        
        <Button
          variant="outline"
          fullWidth
          iconName="TrendingUp"
          iconPosition="left"
          onClick={() => navigate('/price-comparison')}
        >
          Explore Price Comparison
        </Button>
      </div>
      
      {/* Quick Tips */}
      <div className="mt-12 w-full max-w-2xl">
        <h4 className="text-lg font-medium text-foreground mb-4">
          How to get started:
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-3">
              <Icon name="Link" size={20} color="white" />
            </div>
            <h5 className="font-medium text-foreground mb-2">1. Copy Product URL</h5>
            <p className="text-sm text-muted-foreground">
              Copy any product link from Amazon, Walmart, Target, or other supported stores.
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-3">
              <Icon name="Bell" size={20} color="white" />
            </div>
            <h5 className="font-medium text-foreground mb-2">2. Set Price Alert</h5>
            <p className="text-sm text-muted-foreground">
              Choose your target price and get notified when the product goes on sale.
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-3">
              <Icon name="ShoppingCart" size={20} color="white" />
            </div>
            <h5 className="font-medium text-foreground mb-2">3. Buy at Best Price</h5>
            <p className="text-sm text-muted-foreground">
              Track price history and make informed decisions about when to buy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;