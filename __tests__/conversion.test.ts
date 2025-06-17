// @ts-nocheck
import { convert } from '@/lib/conversion';

describe('unit conversions round-trip', () => {
  const pairs: [number, string, string, number][] = [
    [100, 'g', 'oz', 3.5274],
    [1, 'cup', 'ml', 236.588],
    [500, 'ml', 'l', 0.5],
  ];

  it.each(pairs)(
    '%d %s -> %s round trip',
    (qty, from, to, expected) => {
      const toVal = convert(qty, from as any, to as any);
      expect(toVal).toBeCloseTo(expected, 3);
      const back = convert(toVal, to as any, from as any);
      expect(back).toBeCloseTo(qty, 3);
    }
  );
}); 