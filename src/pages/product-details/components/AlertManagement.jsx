import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AlertManagement = ({ currentAlert, onUpdateAlert }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [alertPrice, setAlertPrice] = useState(currentAlert?.targetPrice || '');
  const [emailEnabled, setEmailEnabled] = useState(currentAlert?.emailEnabled || false);
  const [smsEnabled, setSmsEnabled] = useState(currentAlert?.smsEnabled || false);
  const [pushEnabled, setPushEnabled] = useState(currentAlert?.pushEnabled || true);

  const handleSaveAlert = () => {
    const alertData = {
      targetPrice: parseFloat(alertPrice),
      emailEnabled,
      smsEnabled,
      pushEnabled,
      isActive: true
    };
    onUpdateAlert(alertData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setAlertPrice(currentAlert?.targetPrice || '');
    setEmailEnabled(currentAlert?.emailEnabled || false);
    setSmsEnabled(currentAlert?.smsEnabled || false);
    setPushEnabled(currentAlert?.pushEnabled || true);
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Price Alerts</h2>
          <p className="text-sm text-muted-foreground">Get notified when price drops</p>
        </div>
        
        {currentAlert && !isEditing && (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              currentAlert.isActive ? 'bg-success' : 'bg-muted-foreground'
            }`}></div>
            <span className="text-sm text-muted-foreground">
              {currentAlert.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        )}
      </div>

      {!currentAlert ? (
        /* No Alert Set */
        <div className="text-center py-8">
          <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Price Alert Set</h3>
          <p className="text-muted-foreground mb-4">
            Set a target price and get notified when the product price drops below it.
          </p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Create Price Alert
          </Button>
        </div>
      ) : !isEditing ? (
        /* Existing Alert Display */
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Target Price</p>
                <p className="text-2xl font-bold text-foreground">${currentAlert.targetPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-lg font-semibold text-foreground">${currentAlert.currentPrice}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {currentAlert.currentPrice <= currentAlert.targetPrice ? (
                <>
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm text-success font-medium">Target price reached!</span>
                </>
              ) : (
                <>
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    ${(currentAlert.currentPrice - currentAlert.targetPrice).toFixed(2)} above target
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Notification Preferences</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="Smartphone" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Push Notifications</span>
                <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                  currentAlert.pushEnabled 
                    ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                }`}>
                  {currentAlert.pushEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Email Notifications</span>
                <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                  currentAlert.emailEnabled 
                    ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                }`}>
                  {currentAlert.emailEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MessageSquare" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">SMS Notifications</span>
                <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                  currentAlert.smsEnabled 
                    ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                }`}>
                  {currentAlert.smsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              iconName="Edit"
              iconPosition="left"
              onClick={() => setIsEditing(true)}
            >
              Edit Alert
            </Button>
            <Button
              variant="outline"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => onUpdateAlert(null)}
            >
              Delete Alert
            </Button>
          </div>
        </div>
      ) : (
        /* Edit Alert Form */
        <div className="space-y-4">
          <Input
            label="Target Price"
            type="number"
            placeholder="Enter target price"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            description="You'll be notified when the price drops to or below this amount"
          />

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Notification Methods</h4>
            <div className="space-y-3">
              <Checkbox
                label="Push Notifications"
                description="Get instant notifications on your device"
                checked={pushEnabled}
                onChange={(e) => setPushEnabled(e.target.checked)}
              />
              <Checkbox
                label="Email Notifications"
                description="Receive alerts via email"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
              />
              <Checkbox
                label="SMS Notifications"
                description="Get text message alerts (charges may apply)"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-border">
            <Button
              variant="default"
              iconName="Check"
              iconPosition="left"
              onClick={handleSaveAlert}
              disabled={!alertPrice || alertPrice <= 0}
            >
              Save Alert
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertManagement;