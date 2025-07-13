import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendationEngine = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock AI recommendation data
  const generateRecommendation = (product) => {
    const recommendations = [
      {
        action: 'buy_now',
        confidence: 85,
        reason: 'Price is at historical low',
        details: `Current price is 15% below average. Based on 90-day trend analysis, this is an excellent time to purchase.`,
        savings: 45,
        timeframe: 'Limited time'
      },
      {
        action: 'wait',
        confidence: 72,
        reason: 'Price likely to drop further',
        details: `Historical data shows prices typically drop 20% during Black Friday season. Consider waiting 2-3 weeks.`,
        savings: 60,
        timeframe: '2-3 weeks'
      },
      {
        action: 'monitor',
        confidence: 68,
        reason: 'Price is stable',
        details: `Price has been stable for the past month. Set an alert for 10% price drop to get the best deal.`,
        savings: 25,
        timeframe: '1-2 months'
      }
    ];

    return recommendations[Math.floor(Math.random() * recommendations.length)];
  };

  const getRecommendationIcon = (action) => {
    switch (action) {
      case 'buy_now':
        return 'ShoppingCart';
      case 'wait':
        return 'Clock';
      case 'monitor':
        return 'Eye';
      default:
        return 'TrendingUp';
    }
  };

  const getRecommendationColor = (action) => {
    switch (action) {
      case 'buy_now':
        return 'text-success';
      case 'wait':
        return 'text-warning';
      case 'monitor':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'buy_now':
        return 'Buy Now';
      case 'wait':
        return 'Wait to Buy';
      case 'monitor':
        return 'Keep Monitoring';
      default:
        return 'Analyze';
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center py-8">
          <Icon name="Brain" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">AI Recommendations</h3>
          <p className="text-muted-foreground">Add products to get AI-powered purchase recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Brain" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Purchase Recommendations</h3>
          <p className="text-sm text-muted-foreground">Smart insights based on price trends and market analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product) => {
          const recommendation = generateRecommendation(product);
          const isSelected = selectedProduct === product.id;

          return (
            <div key={product.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div>
                    <div className="font-medium text-foreground">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.category}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName={isSelected ? 'ChevronUp' : 'ChevronDown'}
                  onClick={() => setSelectedProduct(isSelected ? null : product.id)}
                />
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className={`flex items-center gap-2 ${getRecommendationColor(recommendation.action)}`}>
                  <Icon name={getRecommendationIcon(recommendation.action)} size={16} />
                  <span className="font-medium">{getActionText(recommendation.action)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Zap" size={14} className="text-warning" />
                  <span className="text-sm font-medium">{recommendation.confidence}% confidence</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Save up to ${recommendation.savings}
                </div>
              </div>

              <div className="text-sm text-foreground mb-3">
                {recommendation.reason}
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Detailed Analysis</h4>
                    <p className="text-sm text-muted-foreground">{recommendation.details}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Potential Savings</div>
                      <div className="text-lg font-semibold text-success">${recommendation.savings}</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Timeframe</div>
                      <div className="text-lg font-semibold text-foreground">{recommendation.timeframe}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {recommendation.action === 'buy_now' && (
                      <Button
                        variant="default"
                        size="sm"
                        iconName="ShoppingCart"
                        onClick={() => console.log('Navigate to best deal')}
                      >
                        View Best Deal
                      </Button>
                    )}
                    {recommendation.action === 'wait' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Bell"
                        onClick={() => console.log('Set price alert')}
                      >
                        Set Alert
                      </Button>
                    )}
                    {recommendation.action === 'monitor' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Eye"
                        onClick={() => console.log('Add to watchlist')}
                      >
                        Add to Watchlist
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Share2"
                      onClick={() => console.log('Share recommendation')}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Recommendations updated every hour based on real-time market data
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => console.log('Refresh recommendations')}
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;