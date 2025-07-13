import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ComparisonTable = ({ products, onRemoveProduct, onSetAlert }) => {
  const [sortBy, setSortBy] = useState('price');

  // Mock platform data for each product
  const getPlatformData = (productId) => {
    const platforms = [
      {
        name: 'Amazon',
        icon: 'ShoppingCart',
        price: Math.floor(Math.random() * 500) + 100,
        originalPrice: Math.floor(Math.random() * 600) + 200,
        availability: Math.random() > 0.2 ? 'In Stock' : 'Out of Stock',
        shipping: Math.random() > 0.5 ? 'Free' : '$9.99',
        rating: (Math.random() * 2 + 3).toFixed(1),
        seller: 'Amazon.com',
        url: '#'
      },
      {
        name: 'Walmart',
        icon: 'Store',
        price: Math.floor(Math.random() * 500) + 100,
        originalPrice: Math.floor(Math.random() * 600) + 200,
        availability: Math.random() > 0.3 ? 'In Stock' : 'Limited Stock',
        shipping: Math.random() > 0.4 ? 'Free' : '$7.99',
        rating: (Math.random() * 2 + 3).toFixed(1),
        seller: 'Walmart',
        url: '#'
      },
      {
        name: 'Target',
        icon: 'Target',
        price: Math.floor(Math.random() * 500) + 100,
        originalPrice: Math.floor(Math.random() * 600) + 200,
        availability: Math.random() > 0.25 ? 'In Stock' : 'Out of Stock',
        shipping: Math.random() > 0.6 ? 'Free' : '$5.99',
        rating: (Math.random() * 2 + 3).toFixed(1),
        seller: 'Target',
        url: '#'
      },
      {
        name: 'Best Buy',
        icon: 'Zap',
        price: Math.floor(Math.random() * 500) + 100,
        originalPrice: Math.floor(Math.random() * 600) + 200,
        availability: Math.random() > 0.35 ? 'In Stock' : 'Backordered',
        shipping: Math.random() > 0.3 ? 'Free' : '$12.99',
        rating: (Math.random() * 2 + 3).toFixed(1),
        seller: 'Best Buy',
        url: '#'
      }
    ];

    return platforms.map(platform => ({
      ...platform,
      discount: Math.round(((platform.originalPrice - platform.price) / platform.originalPrice) * 100)
    }));
  };

  const getLowestPrice = (platforms) => {
    const availablePlatforms = platforms.filter(p => p.availability === 'In Stock');
    if (availablePlatforms.length === 0) return null;
    return Math.min(...availablePlatforms.map(p => p.price));
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="GitCompare" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Products to Compare</h3>
        <p className="text-muted-foreground">Search and add products to start comparing prices across platforms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border border-border rounded-lg">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-4 font-medium text-foreground border-b border-border">Product</th>
              <th className="text-center p-4 font-medium text-foreground border-b border-border">Amazon</th>
              <th className="text-center p-4 font-medium text-foreground border-b border-border">Walmart</th>
              <th className="text-center p-4 font-medium text-foreground border-b border-border">Target</th>
              <th className="text-center p-4 font-medium text-foreground border-b border-border">Best Buy</th>
              <th className="text-center p-4 font-medium text-foreground border-b border-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const platforms = getPlatformData(product.id);
              const lowestPrice = getLowestPrice(platforms);

              return (
                <tr key={product.id} className="border-b border-border last:border-b-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  {platforms.map((platform) => (
                    <td key={platform.name} className="p-4 text-center">
                      <div className="space-y-2">
                        <div className={`text-lg font-semibold ${
                          platform.price === lowestPrice && platform.availability === 'In Stock' ?'text-success' :'text-foreground'
                        }`}>
                          ${platform.price}
                        </div>
                        {platform.discount > 0 && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${platform.originalPrice}
                          </div>
                        )}
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                          platform.availability === 'In Stock' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                        }`}>
                          {platform.availability}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Shipping: {platform.shipping}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <Icon name="Star" size={12} className="text-warning fill-current" />
                          <span>{platform.rating}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(platform.url, '_blank')}
                          disabled={platform.availability !== 'In Stock'}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </td>
                  ))}
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Bell"
                        onClick={() => onSetAlert(product)}
                      >
                        Alert
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={() => onRemoveProduct(product.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => {
          const platforms = getPlatformData(product.id);
          const lowestPrice = getLowestPrice(platforms);

          return (
            <div key={product.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <div className="font-medium text-foreground">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.category}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => onRemoveProduct(product.id)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <div key={platform.name} className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name={platform.icon} size={16} />
                      <span className="font-medium text-sm">{platform.name}</span>
                    </div>
                    <div className={`text-lg font-semibold mb-1 ${
                      platform.price === lowestPrice && platform.availability === 'In Stock' ?'text-success' :'text-foreground'
                    }`}>
                      ${platform.price}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block mb-2 ${
                      platform.availability === 'In Stock' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                    }`}>
                      {platform.availability}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => window.open(platform.url, '_blank')}
                      disabled={platform.availability !== 'In Stock'}
                    >
                      Buy
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Bell"
                  onClick={() => onSetAlert(product)}
                  fullWidth
                >
                  Set Price Alert
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonTable;