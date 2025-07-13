import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supportedPlatforms = [
    { name: 'Amazon', domain: 'amazon.com', example: 'https://amazon.com/product/...' },
    { name: 'Flipkart', domain: 'flipkart.com', example: 'https://flipkart.com/product/...' },
    { name: 'Myntra', domain: 'myntra.com', example: 'https://myntra.com/product/...' },
    { name: 'Croma', domain: 'croma.com', example: 'https://croma.com/product/...' }
  ];

  const detectPlatform = (url) => {
    for (const platform of supportedPlatforms) {
      if (url.includes(platform.domain)) {
        return platform.name;
      }
    }
    return null;
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return detectPlatform(url) !== null;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a product URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL from a supported platform');
      return;
    }

    setIsLoading(true);
    try {
      await onAddProduct(url);
      setUrl('');
      onClose();
    } catch (err) {
      setError('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Add Product to Track</h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={handleClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Product URL"
              type="url"
              placeholder="Paste product URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              error={error}
              required
              description="Copy and paste the product URL from any supported e-commerce platform"
            />

            {url && detectPlatform(url) && (
              <div className="flex items-center space-x-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-success font-medium">
                  {detectPlatform(url)} product detected
                </span>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                iconName="Plus"
                iconPosition="left"
                className="flex-1"
              >
                Add Product
              </Button>
            </div>
          </form>

          {/* Supported Platforms */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Supported Platforms:</h3>
            <div className="grid grid-cols-1 gap-2">
              {supportedPlatforms.map((platform) => (
                <div key={platform.name} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="ShoppingBag" size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{platform.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{platform.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Icon name="Lightbulb" size={14} />
              <span>Tips:</span>
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Make sure the URL is from the product page, not search results</li>
              <li>• We'll automatically detect the platform and start tracking</li>
              <li>• You can set price alerts after adding the product</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;