import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Minus, Loader2 } from 'lucide-react';
import { FoodQuery, DataTypeFilter } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  queries: FoodQuery[];
  loading: boolean;
  dataTypeFilter: DataTypeFilter;
  onAddQuery: () => void;
  onRemoveQuery: (id: string) => void;
  onUpdateQuery: (id: string, text: string) => void;
  onUpdateDataTypeFilter: (filter: DataTypeFilter) => void;
  onSearch: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  queries,
  loading,
  dataTypeFilter,
  onAddQuery,
  onRemoveQuery,
  onUpdateQuery,
  onUpdateDataTypeFilter,
  onSearch
}) => {
  const handleSearch = () => {
    onSearch();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Food Database"
      description="Search the USDA FoodData Central database for detailed nutrition information"
      size="lg"
    >
      <div className="space-y-6">
        {/* Search Queries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Search Terms</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddQuery}
              className="h-8"
            >
              <Plus className="w-4 h-4" />
              Add Term
            </Button>
          </div>
          
          <div className="space-y-3">
            {queries.map((query) => (
              <div key={query.id} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={query.text}
                    onChange={(e) => onUpdateQuery(query.id, e.target.value)}
                    placeholder="Enter food name (e.g., apple, chicken breast)"
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                  />
                </div>
                {queries.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRemoveQuery(query.id)}
                    className="h-10 w-10 flex-shrink-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Type Filters */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Data Types</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={dataTypeFilter.foundation ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdateDataTypeFilter({
                ...dataTypeFilter,
                foundation: !dataTypeFilter.foundation
              })}
            >
              Foundation Foods
            </Button>
            <Button
              variant={dataTypeFilter.branded ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdateDataTypeFilter({
                ...dataTypeFilter,
                branded: !dataTypeFilter.branded
              })}
            >
              Branded Products
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Foundation Foods are generic, non-branded items. Branded Products are specific manufacturer products.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSearch}
            disabled={loading || !queries.some(q => q.text.trim())}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Foods
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 