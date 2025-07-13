import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, authError, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result?.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/login-register?mode=forgot-password', { 
      state: { email: formData?.email } 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData?.email || ''}
            onChange={handleChange}
            error={errors?.email}
            disabled={isSubmitting || loading}
            icon="Mail"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData?.password || ''}
              onChange={handleChange}
              error={errors?.password}
              disabled={isSubmitting || loading}
              icon="Lock"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting || loading}
            >
              <Icon 
                name={showPassword ? 'EyeOff' : 'Eye'} 
                size={16} 
              />
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
            disabled={isSubmitting || loading}
          >
            Forgot your password?
          </button>
        </div>
      </div>

      {/* Error Message */}
      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{authError}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        disabled={isSubmitting || loading}
        iconName={isSubmitting ? 'Loader2' : 'LogIn'}
        iconPosition="left"
        className={isSubmitting ? 'animate-pulse' : ''}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>

      {/* Demo Credentials */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Demo Account:</p>
            <p>Email: user@pricescope.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;