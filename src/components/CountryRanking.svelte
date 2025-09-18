<script lang="ts">
    import { sponsors as sponsorsState } from "../appState.svelte";
    import { alpha3ToEmoji } from "../utils/countries";
    import type { FlagWithTooltipProps } from "./FlagWithTooltip.svelte";
    import FlagWithTooltip from "./FlagWithTooltip.svelte";
    import SortableTable, {
        type SortableTableProps,
    } from "./SortableTable.svelte";

    type SortBy = "country" | "sponsorsCount" | "total" | "average";

    const sponsors = sponsorsState.value;
    if (!sponsors) {
        throw new Error("Sponsors data is not available");
    }

    const headers = [
        ["Country", "country"],
        ["Amount of Sponsors", "sponsorsCount"],
        ["Average Amount ($)", "average"],
        ["Total Amount ($)", "total"],
    ] as [string, SortBy][];

    let sortBy = $state<SortBy>("total");

    const rows = $derived.by<SortableTableProps<FlagWithTooltipProps>["rows"]>(
        () => {
            const countryMap: Record<
                string,
                { sponsorsCount: number; total: number }
            > = {};

            for (const sponsor of sponsors) {
                const country = sponsor.country || "Unknown";

                const c = (countryMap[country] ??= {
                    sponsorsCount: 0,
                    total: 0,
                });

                c.sponsorsCount += 1;
                c.total += sponsor.totalSponsorshipAmountInCents;
            }

            return Object.entries(countryMap)
                .sort((a, b) => {
                    switch (sortBy) {
                        case "country":
                            return a[0].localeCompare(b[0]);
                        case "sponsorsCount":
                            return a[1].sponsorsCount - b[1].sponsorsCount;
                        case "total":
                            return a[1].total - b[1].total;
                        case "average":
                            return (
                                a[1].total / a[1].sponsorsCount -
                                b[1].total / b[1].sponsorsCount
                            );
                    }
                })
                .map(([country, data]) => [
                    {
                        component: FlagWithTooltip,
                        props: { countryAlpha3: country },
                    },
                    data.sponsorsCount.toString(),
                    (data.total / 100 / data.sponsorsCount).toFixed(2),
                    (data.total / 100).toFixed(2),
                ]);
        },
    );
</script>

<SortableTable
    {headers}
    {rows}
    sortValue={sortBy}
    onChangeSortValue={(v) => (sortBy = v as any)}
    initialSortOrder="desc"
/>
