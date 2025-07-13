import React from 'react';

const AuthFooter = () => {
  const currentYear = new Date().getFullYear();

  const handleTermsClick = () => {
    alert('Terms of Service would open in a new window');
  };

  const handlePrivacyClick = () => {
    alert('Privacy Policy would open in a new window');
  };

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <button
            onClick={handleTermsClick}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Terms of Service
          </button>
          <button
            onClick={handlePrivacyClick}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Privacy Policy
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>&copy; {currentYear} PriceScope. All rights reserved.</p>
          <p className="mt-1">Secure authentication powered by industry standards</p>
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Data Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFooter;