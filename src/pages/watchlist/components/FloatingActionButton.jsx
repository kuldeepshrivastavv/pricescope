import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FloatingActionButton = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [productUrl, setProductUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuickAdd = async () => {
    if (!productUrl.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Adding product:', productUrl);
      setProductUrl('');
      setShowQuickAdd(false);
      setIsLoading(false);
      
      // Show success message or navigate
      // For demo, we'll just log
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuickAdd();
    }
    if (e.key === 'Escape') {
      setShowQuickAdd(false);
      setProductUrl('');
    }
  };

  return (
    <>
      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Quick Add Product</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowQuickAdd(false);
                    setProductUrl('');
                  }}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Product URL"
                  type="url"
                  placeholder="Paste product link from any supported store..."
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  onKeyDown={handleKeyPress}
                  description="Supports Amazon, Walmart, Target, Best Buy, and more"
                />
                
                <div className="flex space-x-3">
                  <Button
                    variant="default"
                    fullWidth
                    loading={isLoading}
                    onClick={handleQuickAdd}
                    disabled={!productUrl.trim()}
                  >
                    Add to Watchlist
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Advanced
                  </Button>
                </div>
              </div>
              
              {/* Supported Platforms */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">Supported platforms:</div>
                <div className="flex flex-wrap gap-2">
                  {['Amazon', 'Walmart', 'Target', 'Best Buy', 'eBay'].map(platform => (
                    <span
                      key={platform}
                      className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          variant="default"
          size="lg"
          onClick={() => setShowQuickAdd(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 micro-interaction"
        >
          <Icon name="Plus" size={24} />
        </Button>
      </div>
    </>
  );
};

export default FloatingActionButton;