import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AuthHeader from './components/AuthHeader';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import GoogleAuthButton from './components/GoogleAuthButton';
import AuthFooter from './components/AuthFooter';

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      // Could redirect to dashboard if needed
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Helmet>
        <title>{activeTab === 'login' ? 'Sign In' : 'Create Account'} - PriceScope</title>
        <meta name="description" content="Sign in to PriceScope to track prices, compare deals, and never miss a discount. Secure authentication with Google OAuth support." />
        <meta name="keywords" content="price tracking, login, sign up, deals, discounts, e-commerce" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Minimal Header */}
        <header className="w-full py-4 px-4 lg:px-6">
          <div className="max-w-md mx-auto">
            <AuthHeader />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Authentication Card */}
            <div className="bg-card border border-border rounded-xl shadow-lg p-6 lg:p-8">
              {/* Tab Navigation */}
              <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />

              {/* Form Content */}
              <div className="space-y-6">
                {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
                
                {/* Google OAuth */}
                <GoogleAuthButton />
              </div>
            </div>

            {/* Footer */}
            <AuthFooter />
          </div>
        </main>

        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </>
  );
};

export default LoginRegister;