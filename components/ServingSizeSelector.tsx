import React, { useState } from 'react';
import { Unit, convert } from '@/lib/conversion';
import { cn } from '@/lib/utils';

interface ServingSizeSelectorProps {
  quantity: number;
  unit: Unit;
  onChange: (quantity: number, unit: Unit) => void;
  density?: number;
  className?: string;
}

const UNITS: Unit[] = [
  'mg',
  'g',
  'kg',
  'oz',
  'lb',
  'ml',
  'l',
  'tsp',
  'tbsp',
  'floz',
  'cup',
];

interface QualitativeProps {
  showAs?: string;
  onShowAsChange?: (label: string) => void;
}

export const ServingSizeSelector: React.FC<ServingSizeSelectorProps & QualitativeProps> = ({
  quantity,
  unit,
  onChange,
  density = 1,
  className,
  showAs,
  onShowAsChange,
}) => {
  const [isCustom, setIsCustom] = useState(false);

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    // Enter custom mode
    if (newValue === 'custom') {
      setIsCustom(true);
      return;
    }
    const newUnit = newValue as Unit;
    // Exiting custom mode: clear any custom label
    if (isCustom) {
      setIsCustom(false);
      onShowAsChange?.('');
    }
    if (newUnit === unit) return;
    // Convert current quantity to new unit so numbers remain equivalent
    let newQty = quantity;
    try {
      newQty = parseFloat(convert(quantity, unit, newUnit, density).toFixed(6));
    } catch (_) { /* ignore unsupported conversions */ }
    onChange(newQty, newUnit);
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange(value, unit);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="0.01"
          min="0"
          value={Number(quantity.toFixed(2))}
          onChange={handleQtyChange}
          className="w-20 px-2 py-1 border border-input rounded-md bg-background text-sm"
        />
        <select
          value={unit}
          onChange={handleUnitChange}
          className="px-2 py-1 border border-input rounded-md bg-background text-sm"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
          {!isCustom && (
            <option value="custom">Add Custom</option>
          )}
        </select>
      </div>
      {isCustom && onShowAsChange && (
        <input
          type="text"
          placeholder="Show as (e.g., 1 apple)"
          value={showAs || ''}
          onChange={(e) => onShowAsChange(e.target.value)}
          className="w-full px-2 py-1 border border-input rounded-md bg-background text-xs text-muted-foreground"
        />
      )}
    </div>
  );
}; 