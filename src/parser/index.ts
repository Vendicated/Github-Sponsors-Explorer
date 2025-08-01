import { alpha2ToAlpha3, countryNameToAlpha3 } from "../utils/countries";
import { parseSponsorsCSV } from "./csv";
import { parseSponsorsJSON } from "./json";

export interface SponsorData {
    username: string;
    country: string;
    totalSponsorshipAmountInCents: number;
    firstSponsorshipDate: Date;
}

/** format: $5.00 */
export function parseDollarAmountInCent(amount: string) {
    return parseFloat(amount.replace(/[$,]/g, "")) * 100;
}

// GitHub is crazy
export function normaliseCountry(name: string) {
    name = name.trim().toUpperCase();

    if (name.length === 3) return name;
    if (name.length === 2) return alpha2ToAlpha3(name) ?? name;

    return countryNameToAlpha3(name) ?? name;
}

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
});

export function formatDate(date: Date) {
    return dateTimeFormat.format(date);
}

export function parseSponsors(data: string, format: "json" | "csv") {
    return format === "csv"
        ? parseSponsorsCSV(data)
        : parseSponsorsJSON(data);
}
