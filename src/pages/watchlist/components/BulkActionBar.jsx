import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionBar = ({ selectedCount, onClearSelection, onBulkDelete, onBulkExport, onBulkEditAlerts }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleBulkDelete = () => {
    if (showConfirmDelete) {
      onBulkDelete();
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-6 lg:right-6 z-30">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          {/* Selection Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={20} className="text-primary" />
              <span className="font-medium text-foreground">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center space-x-2">
            {/* Edit Alerts */}
            <Button
              variant="outline"
              size="sm"
              iconName="Bell"
              iconPosition="left"
              onClick={onBulkEditAlerts}
              className="hidden sm:flex"
            >
              Edit Alerts
            </Button>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={onBulkExport}
              className="hidden sm:flex"
            >
              Export
            </Button>

            {/* Mobile Actions Menu */}
            <div className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                iconName="MoreHorizontal"
                onClick={() => {
                  // Show mobile actions menu
                  console.log('Show mobile actions menu');
                }}
              />
            </div>

            {/* Delete */}
            <Button
              variant={showConfirmDelete ? "destructive" : "outline"}
              size="sm"
              iconName={showConfirmDelete ? "AlertTriangle" : "Trash2"}
              iconPosition="left"
              onClick={handleBulkDelete}
              className={showConfirmDelete ? "animate-pulse" : ""}
            >
              {showConfirmDelete ? "Confirm Delete" : "Delete"}
            </Button>
          </div>
        </div>

        {/* Confirmation Message */}
        {showConfirmDelete && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center space-x-2 text-sm text-destructive">
              <Icon name="AlertTriangle" size={16} />
              <span>
                Are you sure you want to delete {selectedCount} item{selectedCount !== 1 ? 's' : ''}? 
                This action cannot be undone.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActionBar;