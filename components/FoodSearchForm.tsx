import React from 'react';
import { Plus, Search, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FoodQuery, DataTypeFilter } from '@/types';

export interface FoodSearchFormProps {
  queries: FoodQuery[];
  loading: boolean;
  dataTypeFilter: DataTypeFilter;
  onAddQuery: () => void;
  onRemoveQuery: (id: string) => void;
  onUpdateQuery: (id: string, text: string) => void;
  onUpdateDataTypeFilter: (filter: DataTypeFilter) => void;
  onSearch: () => void;
}

export const FoodSearchForm: React.FC<FoodSearchFormProps> = ({
  queries,
  loading,
  dataTypeFilter,
  onAddQuery,
  onRemoveQuery,
  onUpdateQuery,
  onUpdateDataTypeFilter,
  onSearch,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {queries.map((query, index) => (
        <div key={query.id} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query.text}
              onChange={(e) => onUpdateQuery(query.id, e.target.value)}
              placeholder={`Enter food item ${index + 1}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {query.text && (
              <button
                type="button"
                onClick={() => onUpdateQuery(query.id, '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemoveQuery(query.id)}
            disabled={queries.length <= 1 || loading}
            aria-label="Remove query"
          >
            <Minus size={16} />
          </Button>
        </div>
      ))}

      <div className="space-y-2 border-t pt-4">
        <p className="text-sm font-medium text-gray-700">Filter by Data Type:</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dataTypeFilter.foundation}
              onChange={(e) => onUpdateDataTypeFilter({
                ...dataTypeFilter,
                foundation: e.target.checked
              })}
              disabled={!dataTypeFilter.branded && dataTypeFilter.foundation}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Foundational Foods (Generic, non-branded items)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dataTypeFilter.branded}
              onChange={(e) => onUpdateDataTypeFilter({
                ...dataTypeFilter,
                branded: e.target.checked
              })}
              disabled={!dataTypeFilter.foundation && dataTypeFilter.branded}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Branded Products (Specific manufacturer products)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddQuery}
          disabled={loading}
        >
          <Plus size={16} />
          Add Another Food
        </Button>
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Search size={16} className="animate-spin" /> Searching...
            </>
          ) : (
            <>
              <Search size={16} /> Search Foods
            </>
          )}
        </Button>
      </div>
    </form>
  );
}; 