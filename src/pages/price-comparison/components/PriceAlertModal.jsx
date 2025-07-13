import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PriceAlertModal = ({ isOpen, onClose, product, onSaveAlert }) => {
  const [alertData, setAlertData] = useState({
    targetPrice: '',
    platforms: [],
    notificationMethod: 'email',
    frequency: 'immediate',
    enabled: true
  });

  const platformOptions = [
    { value: 'amazon', label: 'Amazon' },
    { value: 'walmart', label: 'Walmart' },
    { value: 'target', label: 'Target' },
    { value: 'bestbuy', label: 'Best Buy' }
  ];

  const notificationOptions = [
    { value: 'email', label: 'Email' },
    { value: 'push', label: 'Push Notification' },
    { value: 'both', label: 'Email & Push' }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Summary' }
  ];

  const handlePlatformChange = (platform, checked) => {
    const newPlatforms = checked
      ? [...alertData.platforms, platform]
      : alertData.platforms.filter(p => p !== platform);
    
    setAlertData(prev => ({ ...prev, platforms: newPlatforms }));
  };

  const handleSave = () => {
    if (!alertData.targetPrice || alertData.platforms.length === 0) {
      return;
    }

    const alert = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      targetPrice: parseFloat(alertData.targetPrice),
      platforms: alertData.platforms,
      notificationMethod: alertData.notificationMethod,
      frequency: alertData.frequency,
      enabled: alertData.enabled,
      createdAt: new Date().toISOString()
    };

    onSaveAlert(alert);
    onClose();
    
    // Reset form
    setAlertData({
      targetPrice: '',
      platforms: [],
      notificationMethod: 'email',
      frequency: 'immediate',
      enabled: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Set Price Alert</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Get notified when the price drops
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <img
              src={product?.image}
              alt={product?.name}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div>
              <div className="font-medium text-foreground">{product?.name}</div>
              <div className="text-sm text-muted-foreground">{product?.category}</div>
            </div>
          </div>

          {/* Target Price */}
          <div>
            <Input
              label="Target Price"
              type="number"
              placeholder="Enter target price"
              value={alertData.targetPrice}
              onChange={(e) => setAlertData(prev => ({ ...prev, targetPrice: e.target.value }))}
              description="You'll be notified when the price drops to or below this amount"
              required
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Monitor Platforms
            </label>
            <div className="space-y-2">
              {platformOptions.map((platform) => (
                <Checkbox
                  key={platform.value}
                  label={platform.label}
                  checked={alertData.platforms.includes(platform.value)}
                  onChange={(e) => handlePlatformChange(platform.value, e.target.checked)}
                />
              ))}
            </div>
            {alertData.platforms.length === 0 && (
              <p className="text-sm text-error mt-2">Please select at least one platform</p>
            )}
          </div>

          {/* Notification Method */}
          <div>
            <Select
              label="Notification Method"
              options={notificationOptions}
              value={alertData.notificationMethod}
              onChange={(value) => setAlertData(prev => ({ ...prev, notificationMethod: value }))}
              placeholder="Select notification method"
            />
          </div>

          {/* Frequency */}
          <div>
            <Select
              label="Notification Frequency"
              options={frequencyOptions}
              value={alertData.frequency}
              onChange={(value) => setAlertData(prev => ({ ...prev, frequency: value }))}
              placeholder="Select frequency"
              description="How often you want to receive notifications"
            />
          </div>

          {/* Enable Alert */}
          <div>
            <Checkbox
              label="Enable this alert"
              checked={alertData.enabled}
              onChange={(e) => setAlertData(prev => ({ ...prev, enabled: e.target.checked }))}
              description="You can disable this alert anytime from your alerts page"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!alertData.targetPrice || alertData.platforms.length === 0}
          >
            Create Alert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertModal;