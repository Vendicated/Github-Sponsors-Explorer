import { normaliseCountry, parseDollarAmountInCent, type SponsorData } from ".";

interface Transaction {
    transaction_id: string;
    tier_name: string;
    tier_monthly_amount: string;
    processed_amount: string;
    is_prorated: boolean;
    status: string;
    transaction_date: string;
    billing_country: string;
    billing_region: string;
    vat?: any;
}

interface Sponsor {
    sponsor_handle: string;
    sponsor_profile_name?: any;
    sponsor_public_email?: any;
    sponsorship_started_on: string;
    is_public: boolean;
    is_yearly: boolean;
    transactions: Transaction[];
    payment_source: string;
}

type SponsorJson = Sponsor[];


export function parseSponsorsJSON(text: string): SponsorData[] {
    const data = JSON.parse(text) as SponsorJson;

    return data
        .filter(s => s.transactions.length > 0) // GitHub is insane. If your card gets declined, it will still show you as a sponsor with no transactions
        .map(s => ({
            username: s.sponsor_handle,
            country: normaliseCountry(s.transactions.find(t => t.billing_country)?.billing_country || ""),
            totalSponsorshipAmountInCents: s.transactions.reduce((total, t) => total + parseDollarAmountInCent(t.processed_amount), 0),
            firstSponsorshipDate: new Date(s.sponsorship_started_on)
        }));
}
