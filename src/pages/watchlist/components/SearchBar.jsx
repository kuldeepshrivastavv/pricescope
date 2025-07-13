import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ searchQuery, onSearchChange, onClearSearch, totalResults }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Mock search suggestions
  const mockSuggestions = [
    "iPhone 15 Pro",
    "Samsung Galaxy S24",
    "MacBook Air M3",
    "Sony WH-1000XM5",
    "Nike Air Max",
    "Instant Pot Duo",
    "Kindle Paperwhite",
    "Apple Watch Series 9"
  ];

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-primary ring-opacity-50' : ''
      }`}>
        <Icon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" 
        />
        
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search your watchlist..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            // Delay hiding suggestions to allow clicks
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20"
        />
        
        {/* Search Actions */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSearch}
              className="h-6 w-6"
            >
              <Icon name="X" size={14} />
            </Button>
          )}
          
          {/* Results Count */}
          {searchQuery && totalResults !== undefined && (
            <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
              {totalResults}
            </div>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 contextual-tooltip">
          <div className="p-2">
            <div className="text-xs text-muted-foreground px-2 py-1 border-b border-border mb-1">
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors duration-150 flex items-center space-x-2"
              >
                <Icon name="Search" size={14} className="text-muted-foreground" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Tips */}
      {isFocused && !searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 contextual-tooltip">
          <div className="p-3">
            <div className="text-xs text-muted-foreground mb-2">Search tips:</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>• Search by product name or brand</div>
              <div>• Use quotes for exact matches</div>
              <div>• Filter by platform or category</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;