import "server-only";

export interface TaxBreakdown {
  hsnSacCode: string;
  taxRatePercent: number;
  totalSubunits: number;
  taxableSubunits: number;
  taxSubunits: number;
  cgstSubunits: number;
  sgstSubunits: number;
  igstSubunits: number;
  isInterState: boolean;
}

/**
 * Standard Indian HSN / SAC mappings for Dr. Manisha Belvalkar offerings:
 * - Books (Printed guidebook): HSN 4901 (GST Exempt 0%)
 * - Card Decks (Shakti oracle): HSN 9504 (12% GST)
 * - Crystal & Salt Decor: HSN 6802 (18% GST)
 * - Recorded Courses / Education: SAC 999293 (18% GST)
 * - Spiritual Mentoring / Personal Guidance: SAC 998399 (18% GST)
 * - Healing Services / Rituals: SAC 999799 (18% GST)
 */
export function getHsnSacAndRate(itemType: string, slug: string): { hsnSacCode: string; rate: number } {
  if (itemType === "course") {
    return { hsnSacCode: "999293", rate: 18 };
  }

  if (itemType === "service" || itemType === "mentoring") {
    return { hsnSacCode: "998399", rate: 18 };
  }

  if (itemType === "healing") {
    return { hsnSacCode: "999799", rate: 18 };
  }

  if (itemType === "product") {
    if (slug === "shakti-deck-guidebook") {
      // Printed books are exempt under GST in India
      return { hsnSacCode: "4901", rate: 0 };
    }
    if (slug === "shakti-oracle-deck") {
      return { hsnSacCode: "9504", rate: 12 };
    }
    if (slug.includes("salt") || slug.includes("frame")) {
      return { hsnSacCode: "6802", rate: 18 };
    }
    if (slug.includes("ritual")) {
      return { hsnSacCode: "999799", rate: 18 };
    }
    return { hsnSacCode: "9504", rate: 18 };
  }

  return { hsnSacCode: "999799", rate: 18 };
}

/**
 * Check if the customer address is within Maharashtra (Seller home state: Code 27)
 */
export function isIntraStateSupply(stateNameOrCode?: string | null): boolean {
  if (!stateNameOrCode) return true; // Default to intra-state if unspecified
  const clean = stateNameOrCode.trim().toLowerCase();
  return clean === "maharashtra" || clean === "mh" || clean === "27";
}

/**
 * Calculates GST breakdown for a gross (tax-inclusive) amount in subunits (paise).
 * Taxable Value = Gross / (1 + Rate / 100)
 * Tax Amount = Gross - Taxable Value
 */
export function calculateGstBreakdown(
  itemType: string,
  slug: string,
  totalSubunits: number,
  customerState?: string | null
): TaxBreakdown {
  const { hsnSacCode, rate } = getHsnSacAndRate(itemType, slug);
  const isInter = !isIntraStateSupply(customerState);

  if (rate <= 0) {
    return {
      hsnSacCode,
      taxRatePercent: 0,
      totalSubunits,
      taxableSubunits: totalSubunits,
      taxSubunits: 0,
      cgstSubunits: 0,
      sgstSubunits: 0,
      igstSubunits: 0,
      isInterState: isInter,
    };
  }

  // Taxable Value = total / (1 + rate / 100)
  const taxableSubunits = Math.round(totalSubunits / (1 + rate / 100));
  const taxSubunits = totalSubunits - taxableSubunits;

  let cgstSubunits = 0;
  let sgstSubunits = 0;
  let igstSubunits = 0;

  if (isInter) {
    igstSubunits = taxSubunits;
  } else {
    // Split equally into CGST and SGST
    cgstSubunits = Math.floor(taxSubunits / 2);
    sgstSubunits = taxSubunits - cgstSubunits;
  }

  return {
    hsnSacCode,
    taxRatePercent: rate,
    totalSubunits,
    taxableSubunits,
    taxSubunits,
    cgstSubunits,
    sgstSubunits,
    igstSubunits,
    isInterState: isInter,
  };
}

/**
 * Returns Indian Financial Year string (e.g. "2026-27" for Nov 2026)
 */
export function getCurrentFinancialYear(date: Date = new Date()): string {
  const month = date.getMonth(); // 0 is January, 3 is April
  const year = date.getFullYear();

  if (month >= 3) {
    // April to December: current year to next year
    const nextYearShort = String((year + 1) % 100).padStart(2, "0");
    return `${year}-${nextYearShort}`;
  } else {
    // January to March: prev year to current year
    const curYearShort = String(year % 100).padStart(2, "0");
    return `${year - 1}-${curYearShort}`;
  }
}
