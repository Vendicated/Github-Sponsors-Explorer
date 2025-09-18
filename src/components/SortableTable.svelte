<script lang="ts">
    import type { Component } from "svelte";

    export interface SortableTableProps<T extends Record<string, any>> {
        headers: [string, string][];
        rows: (string | { component: Component<T>; props: T })[][];
        sortValue: string;
        onChangeSortValue: (sortName: string) => void;
        initialSortOrder?: "asc" | "desc";
    }

    const {
        headers,
        rows,
        sortValue,
        onChangeSortValue: onChangeSort,
        initialSortOrder = "asc",
    }: SortableTableProps<any> = $props();

    let sortOrder = $state(initialSortOrder);

    function onSortClick(sortName: string) {
        if (sortValue === sortName) {
            sortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            onChangeSort(sortName);
            sortOrder = "asc";
        }
    }

    const orderedRows = $derived(
        sortOrder === "desc" ? rows.toReversed() : rows,
    );
</script>

<table>
    <thead>
        <tr>
            {#each headers as [header, sortName]}
                <th
                    data-sort={sortValue === sortName ? sortOrder : null}
                    onclick={() => onSortClick(sortName)}
                >
                    {header}
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        <!-- TODO add either lazy scroll or pagination -->
        {#each orderedRows.slice(0, 50) as row}
            <tr>
                {#each row as cell}
                    <td>
                        {#if typeof cell === "string"}
                            {cell}
                        {:else}
                            <cell.component {...cell.props} />
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        min-width: 100%;
        border-collapse: collapse;
        border: 2px solid var(--fg);
        font-size: 1.5rem;
    }

    thead {
        position: sticky;
        top: 0;
        background-color: var(--bg);
        border-bottom: 2px solid var(--fg);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        z-index: 1;
    }

    th,
    td {
        text-align: center;
        border: 1px solid var(--fg);
        padding: 0.8em 1em;
    }

    th {
        cursor: pointer;
    }

    th[data-sort="asc"]::after {
        content: " ▲";
        position: absolute;
    }
    th[data-sort="desc"]::after {
        content: " ▼";
        position: absolute;
    }
</style>
