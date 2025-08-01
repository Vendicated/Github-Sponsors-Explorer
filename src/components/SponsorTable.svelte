<script lang="ts">
    import { sponsors as sponsorsState } from "../appState.svelte";
    import { formatDate } from "../parser";
    import { alpha3ToEmoji } from "../utils/countries";
    import { debounce } from "../utils/debounce";
    import SortableTable from "./SortableTable.svelte";

    type SortBy = "country" | "username" | "date" | "total";

    const sponsors = sponsorsState.value;
    if (!sponsors) {
        throw new Error("Sponsors data is not available");
    }

    let usernameFilter = $state<string>("");

    let sortBy = $state<SortBy>("date");

    let filteredSponsors = $state(sponsors);

    const doFilterDebounced = debounce((usernameFilter: string) => {
        if (!usernameFilter) {
            filteredSponsors = sponsors;
            return;
        }

        const usernameFilterLower = usernameFilter.toLowerCase();
        filteredSponsors = sponsors.filter((sponsor) =>
            sponsor.username.toLowerCase().includes(usernameFilterLower),
        );
    }, 150);

    $effect(() => doFilterDebounced(usernameFilter));

    const sortedSponsors = $derived.by(() => {
        return filteredSponsors.toSorted((a, b) => {
            switch (sortBy) {
                case "country":
                    return a.country.localeCompare(b.country);
                case "username":
                    return a.username.localeCompare(b.username);
                case "date":
                    return (
                        a.firstSponsorshipDate.getTime() -
                        b.firstSponsorshipDate.getTime()
                    );
                case "total":
                    return (
                        a.totalSponsorshipAmountInCents -
                        b.totalSponsorshipAmountInCents
                    );
            }
        });
    });

    const headers = [
        ["Country", "country"],
        ["Username", "username"],
        ["First Sponsor Date", "date"],
        ["Total Amount ($)", "total"],
    ] as [string, SortBy][];

    const rows = $derived(
        sortedSponsors.map((sponsor) => [
            alpha3ToEmoji(sponsor.country),
            sponsor.username,
            formatDate(sponsor.firstSponsorshipDate),
            (sponsor.totalSponsorshipAmountInCents / 100).toFixed(2),
        ]),
    );

    function onSortChange(sortName: string) {
        sortBy = sortName as SortBy;
    }
</script>

<input
    type="text"
    placeholder="Filter by username..."
    bind:value={usernameFilter}
/>

<SortableTable
    {headers}
    {rows}
    initialSortOrder="desc"
    sortValue={sortBy}
    onChangeSortValue={onSortChange}
/>

<style>
    input {
        width: 100%;
        font-size: 1.2rem;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        box-sizing: border-box;
    }
</style>
