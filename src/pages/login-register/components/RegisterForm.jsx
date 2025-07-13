import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp, authError, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

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

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

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

    if (!formData?.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        role: 'free'
      });
      
      if (result?.success) {
        // Show success message or redirect
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Full Name Input */}
        <div>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData?.fullName || ''}
            onChange={handleChange}
            error={errors?.fullName}
            disabled={isSubmitting || loading}
            icon="User"
            required
          />
        </div>

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
              placeholder="Create a password"
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

        {/* Confirm Password Input */}
        <div>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData?.confirmPassword || ''}
              onChange={handleChange}
              error={errors?.confirmPassword}
              disabled={isSubmitting || loading}
              icon="Lock"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting || loading}
            >
              <Icon 
                name={showConfirmPassword ? 'EyeOff' : 'Eye'} 
                size={16} 
              />
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isSubmitting || loading}
                className="w-4 h-4 text-primary bg-white border-border rounded focus:ring-primary focus:ring-2"
              />
            </div>
            <div className="text-sm">
              <label htmlFor="terms" className="font-medium text-foreground cursor-pointer">
                I accept the{' '}
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 underline"
                  onClick={() => window.open('/terms', '_blank')}
                >
                  Terms and Conditions
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 underline"
                  onClick={() => window.open('/privacy', '_blank')}
                >
                  Privacy Policy
                </button>
              </label>
            </div>
          </div>
          {errors?.terms && (
            <p className="text-sm text-red-500 ml-7">{errors.terms}</p>
          )}
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
        iconName={isSubmitting ? 'Loader2' : 'UserPlus'}
        iconPosition="left"
        className={isSubmitting ? 'animate-pulse' : ''}
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </Button>

      {/* Additional Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="CheckCircle" size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-700">
            <p className="font-medium mb-1">Free Account Includes:</p>
            <ul className="space-y-1 ml-2">
              <li>• Track up to 10 products</li>
              <li>• Basic price alerts</li>
              <li>• 30-day price history</li>
              <li>• Email notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;