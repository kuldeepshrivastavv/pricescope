import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIRecommendation = ({ recommendation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRecommendationColor = (type) => {
    switch (type) {
      case 'buy':
        return 'bg-success/10 text-success border-success/20';
      case 'wait':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'monitor':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'buy':
        return 'ShoppingCart';
      case 'wait':
        return 'Clock';
      case 'monitor':
        return 'Eye';
      default:
        return 'HelpCircle';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <Icon name="Brain" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">AI Purchase Recommendation</h2>
          <p className="text-sm text-muted-foreground">Smart insights based on price trends</p>
        </div>
      </div>

      <div className={`border rounded-lg p-4 mb-4 ${getRecommendationColor(recommendation.type)}`}>
        <div className="flex items-center space-x-3 mb-3">
          <Icon name={getRecommendationIcon(recommendation.type)} size={24} />
          <div>
            <h3 className="text-lg font-semibold">{recommendation.title}</h3>
            <p className="text-sm opacity-80">{recommendation.subtitle}</p>
          </div>
        </div>
        
        <p className="text-sm leading-relaxed mb-3">{recommendation.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Confidence:</span>
              <span className={`text-sm font-bold ${getConfidenceColor(recommendation.confidence)}`}>
                {recommendation.confidence}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Expected Savings:</span>
              <span className="text-sm font-bold text-success">${recommendation.expectedSavings}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'} Details
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Detailed Analysis */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Detailed Analysis</h4>
            <div className="space-y-3">
              {recommendation.factors.map((factor, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Icon 
                    name={factor.positive ? 'CheckCircle' : 'AlertCircle'} 
                    size={16} 
                    className={factor.positive ? 'text-success' : 'text-warning'} 
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{factor.title}</p>
                    <p className="text-xs text-muted-foreground">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Prediction */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Price Prediction</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Next Week</p>
                <p className="text-lg font-semibold text-foreground">${recommendation.predictions.nextWeek}</p>
                <p className={`text-xs ${recommendation.predictions.nextWeekTrend === 'up' ? 'text-destructive' : 'text-success'}`}>
                  {recommendation.predictions.nextWeekTrend === 'up' ? '↗' : '↘'} 
                  {recommendation.predictions.nextWeekChange}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Next Month</p>
                <p className="text-lg font-semibold text-foreground">${recommendation.predictions.nextMonth}</p>
                <p className={`text-xs ${recommendation.predictions.nextMonthTrend === 'up' ? 'text-destructive' : 'text-success'}`}>
                  {recommendation.predictions.nextMonthTrend === 'up' ? '↗' : '↘'} 
                  {recommendation.predictions.nextMonthChange}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Best Time</p>
                <p className="text-lg font-semibold text-foreground">${recommendation.predictions.bestPrice}</p>
                <p className="text-xs text-muted-foreground">{recommendation.predictions.bestTime}</p>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Market Insights</h4>
            <div className="space-y-2">
              {recommendation.insights.map((insight, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name="Info" size={14} className="text-primary" />
                  <span className="text-sm text-foreground">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              iconName="Bell"
              iconPosition="left"
              onClick={() => console.log('Set price alert')}
            >
              Set Price Alert
            </Button>
            <Button
              variant="outline"
              iconName="Calendar"
              iconPosition="left"
              onClick={() => console.log('Remind me later')}
            >
              Remind Me Later
            </Button>
            <Button
              variant="outline"
              iconName="Share2"
              iconPosition="left"
              onClick={() => console.log('Share recommendation')}
            >
              Share Insights
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendation;