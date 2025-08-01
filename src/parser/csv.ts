import { normaliseCountry, parseDollarAmountInCent, type SponsorData } from ".";
import { parseHeadersAndRows, type ParsedCSVRow, type ParsedCSVValue } from "./csvjs";

export function parseSponsorsCSV(text: string): SponsorData[] {
    const { headers, rows } = parseHeadersAndRows(text);

    const makeColumnGetter = (header: string) => {
        const index = headers.indexOf(header);
        return (row: ParsedCSVRow) => String(row[index]);
    }

    const getUsername = makeColumnGetter("Sponsor Handle");
    const getCountry = makeColumnGetter("Country");
    const getProcessedAmount = makeColumnGetter("Processed Amount");
    const getSponsorshipStartedOn = makeColumnGetter("Sponsorship Started On");

    const data: SponsorData[] = [];

    let currentSponsor: SponsorData = {
        username: "",
        country: "",
        totalSponsorshipAmountInCents: 0,
        firstSponsorshipDate: new Date(0)
    };

    for (const row of rows) {
        const username = getUsername(row);

        const country = getCountry(row);
        const processedAmount = getProcessedAmount(row);
        const sponsorshipStartedOn = getSponsorshipStartedOn(row);

        if (currentSponsor.username !== username) {
            if (currentSponsor.username) {
                data.push(currentSponsor);
            }
            currentSponsor = {
                username,
                country: normaliseCountry(country),
                totalSponsorshipAmountInCents: 0,
                firstSponsorshipDate: new Date(sponsorshipStartedOn)
            };
        }

        currentSponsor.totalSponsorshipAmountInCents += parseDollarAmountInCent(processedAmount);
    }

    if (currentSponsor.username) {
        data.push(currentSponsor);
    }

    return data;
}
