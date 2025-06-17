// Unit conversion utilities for serving-size adjustments
// Supports common metric and imperial volume/weight units, plus generic "piece" count.
// If converting between weight and volume, a density (g/ml) can be passed — defaults to water (1).

export type WeightUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb'
export type VolumeUnit = 'ml' | 'l' | 'tsp' | 'tbsp' | 'floz' | 'cup'
export type Unit = WeightUnit | VolumeUnit

// Base reference factors to grams (for weight) or millilitres (for volume)
const WEIGHT_IN_GRAMS: Record<WeightUnit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: 28.3495231,
  lb: 453.59237,
}

const VOLUME_IN_ML: Record<VolumeUnit, number> = {
  ml: 1,
  l: 1000,
  tsp: 4.92892,
  tbsp: 14.7868,
  floz: 29.5735,
  cup: 236.588,
}

/**
 * Convert a numeric value from one unit to another.
 * For weight↔volume conversions, specify `density` in g/ml.
 */
export function convert(
  value: number,
  from: Unit,
  to: Unit,
  density: number = 1 // g per ml, defaults to water
): number {
  if (from === to) return value

  // Weight ↔ Weight
  if (isWeight(from) && isWeight(to)) {
    const grams = value * WEIGHT_IN_GRAMS[from]
    return grams / WEIGHT_IN_GRAMS[to]
  }

  // Volume ↔ Volume
  if (isVolume(from) && isVolume(to)) {
    const ml = value * VOLUME_IN_ML[from]
    return ml / VOLUME_IN_ML[to]
  }

  // Weight → Volume
  if (isWeight(from) && isVolume(to)) {
    const grams = value * WEIGHT_IN_GRAMS[from]
    const ml = grams / density
    return ml / VOLUME_IN_ML[to]
  }

  // Volume → Weight
  if (isVolume(from) && isWeight(to)) {
    const ml = value * VOLUME_IN_ML[from]
    const grams = ml * density
    return grams / WEIGHT_IN_GRAMS[to]
  }

  // Piece conversions are not meaningful without additional context
  throw new Error('Unsupported unit conversion')
}

export function isWeight(u: Unit): u is WeightUnit {
  return (['mg', 'g', 'kg', 'oz', 'lb'] as Unit[]).includes(u)
}
export function isVolume(u: Unit): u is VolumeUnit {
  return (['ml', 'l', 'tsp', 'tbsp', 'floz', 'cup'] as Unit[]).includes(u)
}

/** Convenience: returns metric equivalent if given imperial, else returns same */
export function toMetric(value: number, unit: Unit, density = 1): { value: number; unit: Unit } {
  if (unit === 'oz') return { value: convert(value, 'oz', 'g'), unit: 'g' }
  if (unit === 'lb') return { value: convert(value, 'lb', 'g'), unit: 'g' }
  if (unit === 'floz') return { value: convert(value, 'floz', 'ml'), unit: 'ml' }
  if (unit === 'cup') return { value: convert(value, 'cup', 'ml'), unit: 'ml' }
  return { value, unit }
}

/** Opposite of toMetric */
export function toImperial(value: number, unit: Unit, density = 1): { value: number; unit: Unit } {
  if (unit === 'g') return { value: convert(value, 'g', 'oz'), unit: 'oz' }
  if (unit === 'kg') return { value: convert(value, 'kg', 'lb'), unit: 'lb' }
  if (unit === 'ml') return { value: convert(value, 'ml', 'floz'), unit: 'floz' }
  if (unit === 'l') return { value: convert(value, 'l', 'cup'), unit: 'cup' }
  return { value, unit }
} 