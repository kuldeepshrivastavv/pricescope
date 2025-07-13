import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <Icon name="TrendingUp" size={28} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">PriceScope</h1>
          <p className="text-sm text-muted-foreground -mt-1">Track. Compare. Win.</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground text-sm">
          Sign in to your account to continue tracking the best deals
        </p>
      </div>
    </div>
  );
};

export default AuthHeader;