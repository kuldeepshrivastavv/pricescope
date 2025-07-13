import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LoginRegister from "pages/login-register";
import Dashboard from "pages/dashboard";
import Watchlist from "pages/watchlist";
import AlertsNotifications from "pages/alerts-notifications";
import PriceComparison from "pages/price-comparison";
import ProductDetails from "pages/product-details";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/alerts-notifications" element={<AlertsNotifications />} />
        <Route path="/price-comparison" element={<PriceComparison />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;