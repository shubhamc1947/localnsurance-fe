/**
 * Pricing data derived from the pricing-calculator.csv (2024 rates).
 *
 * The CSV contains per-age-band annual rates across multiple insurance areas.
 * We map the 5 frontend regions to representative CSV areas:
 *
 *   North/Central America  →  Area 5
 *   South America          →  Area 7 (Costa Rica / LatAm)
 *   Europe                 →  Area 11
 *   Middle East / Africa   →  Area 12 (Saudi Arabia)
 *   Asia Pacific           →  Area 17 (China)
 *
 * UI age bands are consolidated from the 14 CSV bands into 6 groups.
 * Each rate is the rounded average of the CSV bands within that group.
 */

export const AGE_BANDS = [
  "0-17",
  "18-30",
  "31-45",
  "46-60",
  "61-75",
  "76+",
] as const;

export type AgeBand = (typeof AGE_BANDS)[number];

/** Annual per-member rates (USD) — keyed by region id then age band */
export const regionRates: Record<string, Record<AgeBand, number>> = {
  "north-central-america": {
    "0-17": 2440,
    "18-30": 4000,
    "31-45": 4977,
    "46-60": 7464,
    "61-75": 17040,
    "76+": 27753,
  },
  "south-america": {
    "0-17": 1952,
    "18-30": 3200,
    "31-45": 3981,
    "46-60": 5970,
    "61-75": 13629,
    "76+": 22197,
  },
  europe: {
    "0-17": 1742,
    "18-30": 2856,
    "31-45": 3554,
    "46-60": 5329,
    "61-75": 12167,
    "76+": 19815,
  },
  "middle-east-africa": {
    "0-17": 3452,
    "18-30": 5660,
    "31-45": 7042,
    "46-60": 10560,
    "61-75": 24109,
    "76+": 39265,
  },
  "asia-pacific": {
    "0-17": 3818,
    "18-30": 6259,
    "31-45": 7788,
    "46-60": 11678,
    "61-75": 26662,
    "76+": 43423,
  },
};

/** Plan multipliers applied to the base (medium) rates */
export const planMultipliers: Record<string, number> = {
  basic: 0.7,
  medium: 1.0,
  pro: 1.3,
};

/** Compute the per-member rate for a given age band, set of regions, and plan */
export function getMemberRate(
  ageBand: AgeBand,
  selectedRegions: string[],
  plan: string | null
): number {
  if (selectedRegions.length === 0) return 0;

  const avgRate =
    selectedRegions.reduce((sum, regionId) => {
      const rates = regionRates[regionId];
      return sum + (rates ? rates[ageBand] : 0);
    }, 0) / selectedRegions.length;

  const multiplier = plan ? (planMultipliers[plan] ?? 1) : 1;
  return Math.round(avgRate * multiplier);
}
