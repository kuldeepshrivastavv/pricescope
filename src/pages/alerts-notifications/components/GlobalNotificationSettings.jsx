import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const GlobalNotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    dailyDigest: true,
    weeklyReport: false,
    instantAlerts: true,
    quietHours: true,
    marketingEmails: false
  });

  const [quietHoursTime, setQuietHoursTime] = useState({
    start: '22:00',
    end: '08:00'
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleQuietHoursChange = (type, value) => {
    setQuietHoursTime(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Notification Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage how you receive alerts and updates
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Primary Notification Methods */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            Notification Methods
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Receive price drop notifications via email
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('emailAlerts', !settings.emailAlerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.emailAlerts ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={20} className="text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Get instant alerts on your device
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.pushNotifications ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="MessageSquare" size={20} className="text-warning" />
                <div>
                  <p className="text-sm font-medium text-foreground">SMS Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Text messages for urgent price drops
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('smsAlerts', !settings.smsAlerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.smsAlerts ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Frequency Settings */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            Frequency & Timing
          </h3>
          <div className="space-y-3">
            <Checkbox
              label="Instant Alerts"
              description="Get notified immediately when price targets are met"
              checked={settings.instantAlerts}
              onChange={(e) => handleSettingChange('instantAlerts', e.target.checked)}
            />
            
            <Checkbox
              label="Daily Digest"
              description="Summary of all price changes once per day"
              checked={settings.dailyDigest}
              onChange={(e) => handleSettingChange('dailyDigest', e.target.checked)}
            />
            
            <Checkbox
              label="Weekly Report"
              description="Comprehensive weekly analysis of your tracked products"
              checked={settings.weeklyReport}
              onChange={(e) => handleSettingChange('weeklyReport', e.target.checked)}
            />
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            Quiet Hours
          </h3>
          <div className="space-y-4">
            <Checkbox
              label="Enable Quiet Hours"
              description="Pause non-urgent notifications during specified hours"
              checked={settings.quietHours}
              onChange={(e) => handleSettingChange('quietHours', e.target.checked)}
            />
            
            {settings.quietHours && (
              <div className="ml-6 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={quietHoursTime.start}
                      onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={quietHoursTime.end}
                      onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Preferences */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            Additional Preferences
          </h3>
          <div className="space-y-3">
            <Checkbox
              label="Marketing Emails"
              description="Receive promotional offers and product recommendations"
              checked={settings.marketingEmails}
              onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <Icon name="CheckCircle" size={20} className="text-success mx-auto mb-1" />
              <p className="text-xs font-medium text-success">Email Connected</p>
            </div>
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <Icon name="Smartphone" size={20} className="text-success mx-auto mb-1" />
              <p className="text-xs font-medium text-success">Push Enabled</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Icon name="MessageSquare" size={20} className="text-muted-foreground mx-auto mb-1" />
              <p className="text-xs font-medium text-muted-foreground">SMS Setup Required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalNotificationSettings;