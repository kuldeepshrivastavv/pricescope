import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateAlertWizard = ({ isOpen, onClose, onCreateAlert }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [alertData, setAlertData] = useState({
    productUrl: '',
    productName: '',
    targetPrice: '',
    alertType: 'price-drop',
    thresholdType: 'fixed',
    thresholdValue: '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    frequency: 'instant'
  });

  const [errors, setErrors] = useState({});

  const alertTypeOptions = [
    { value: 'price-drop', label: 'Price Drop Alert' },
    { value: 'target-price', label: 'Target Price Alert' },
    { value: 'back-in-stock', label: 'Back in Stock Alert' },
    { value: 'price-increase', label: 'Price Increase Alert' }
  ];

  const thresholdTypeOptions = [
    { value: 'fixed', label: 'Fixed Amount ($)' },
    { value: 'percentage', label: 'Percentage (%)' }
  ];

  const frequencyOptions = [
    { value: 'instant', label: 'Instant' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  const handleInputChange = (field, value) => {
    setAlertData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNotificationChange = (type, value) => {
    setAlertData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!alertData.productUrl.trim()) {
          newErrors.productUrl = 'Product URL is required';
        } else if (!isValidUrl(alertData.productUrl)) {
          newErrors.productUrl = 'Please enter a valid product URL';
        }
        break;
      
      case 2:
        if (!alertData.targetPrice) {
          newErrors.targetPrice = 'Target price is required';
        } else if (isNaN(alertData.targetPrice) || parseFloat(alertData.targetPrice) <= 0) {
          newErrors.targetPrice = 'Please enter a valid price';
        }
        
        if (!alertData.thresholdValue) {
          newErrors.thresholdValue = 'Threshold value is required';
        } else if (isNaN(alertData.thresholdValue) || parseFloat(alertData.thresholdValue) <= 0) {
          newErrors.thresholdValue = 'Please enter a valid threshold';
        }
        break;
      
      case 3:
        if (!alertData.notifications.email && !alertData.notifications.push && !alertData.notifications.sms) {
          newErrors.notifications = 'Please select at least one notification method';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onCreateAlert(alertData);
      onClose();
      // Reset form
      setCurrentStep(1);
      setAlertData({
        productUrl: '',
        productName: '',
        targetPrice: '',
        alertType: 'price-drop',
        thresholdType: 'fixed',
        thresholdValue: '',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        frequency: 'instant'
      });
      setErrors({});
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Product Information';
      case 2: return 'Alert Configuration';
      case 3: return 'Notification Preferences';
      default: return 'Create Alert';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Create New Alert</h2>
            <p className="text-sm text-muted-foreground">{getStepTitle()}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            className="h-8 w-8"
          />
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 rounded ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <Input
                label="Product URL"
                type="url"
                placeholder="https://amazon.com/product-link"
                description="Paste the product URL from any supported e-commerce platform"
                value={alertData.productUrl}
                onChange={(e) => handleInputChange('productUrl', e.target.value)}
                error={errors.productUrl}
                required
              />

              <Input
                label="Product Name (Optional)"
                type="text"
                placeholder="Custom name for this product"
                description="Leave blank to auto-detect from URL"
                value={alertData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
              />

              <Select
                label="Alert Type"
                options={alertTypeOptions}
                value={alertData.alertType}
                onChange={(value) => handleInputChange('alertType', value)}
                description="Choose what type of alert you want to receive"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Input
                label="Target Price"
                type="number"
                placeholder="0.00"
                description="The price you want to be alerted about"
                value={alertData.targetPrice}
                onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                error={errors.targetPrice}
                required
              />

              <Select
                label="Threshold Type"
                options={thresholdTypeOptions}
                value={alertData.thresholdType}
                onChange={(value) => handleInputChange('thresholdType', value)}
                description="How you want to set the alert threshold"
              />

              <Input
                label={`Threshold ${alertData.thresholdType === 'percentage' ? 'Percentage' : 'Amount'}`}
                type="number"
                placeholder={alertData.thresholdType === 'percentage' ? '10' : '5.00'}
                description={
                  alertData.thresholdType === 'percentage' ?'Alert when price drops by this percentage' :'Alert when price drops by this amount'
                }
                value={alertData.thresholdValue}
                onChange={(e) => handleInputChange('thresholdValue', e.target.value)}
                error={errors.thresholdValue}
                required
              />

              <Select
                label="Alert Frequency"
                options={frequencyOptions}
                value={alertData.frequency}
                onChange={(value) => handleInputChange('frequency', value)}
                description="How often you want to receive alerts"
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Notification Methods
                </h3>
                {errors.notifications && (
                  <p className="text-sm text-destructive mb-3">{errors.notifications}</p>
                )}
                <div className="space-y-3">
                  <Checkbox
                    label="Email Notifications"
                    description="Receive alerts via email"
                    checked={alertData.notifications.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  />
                  
                  <Checkbox
                    label="Push Notifications"
                    description="Get instant alerts on your device"
                    checked={alertData.notifications.push}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  />
                  
                  <Checkbox
                    label="SMS Notifications"
                    description="Text message alerts for urgent price drops"
                    checked={alertData.notifications.sms}
                    onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Alert Summary</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><span className="font-medium">Type:</span> {alertTypeOptions.find(opt => opt.value === alertData.alertType)?.label}</p>
                  <p><span className="font-medium">Target:</span> ${alertData.targetPrice}</p>
                  <p><span className="font-medium">Threshold:</span> {alertData.thresholdValue}{alertData.thresholdType === 'percentage' ? '%' : '$'}</p>
                  <p><span className="font-medium">Frequency:</span> {frequencyOptions.find(opt => opt.value === alertData.frequency)?.label}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handlePrevious}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="flex items-center space-x-2">
            {currentStep < 3 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create Alert
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAlertWizard;